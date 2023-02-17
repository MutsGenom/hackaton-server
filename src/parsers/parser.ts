import * as XLSX from 'xlsx';

function setNullAsZero(dataset: XLSX.WorkBook, datasetPages: string[]) {
  const titles = returnAllTitle(dataset, datasetPages);
  const stopColumn = String.fromCharCode('A'.charCodeAt(0) + titles.length);
  const everyColumnOfTable = [];
  for (let i = 0; i < titles.length; i++) {
    everyColumnOfTable.push(String.fromCharCode('A'.charCodeAt(0) + i));
  }
}

const parser = (columns: string[], strings: any) => {
  const array = [];
  let counter = 0;
  let object = {};
  for (let i = 0; i < strings.length; i++) {
    object[columns[counter]] = strings[i];
    counter++;
    if (counter == columns.length) {
      counter = 0;
      array.push(object);
      object = {};
    }
  }
  return array;
};

function returnAllRegions(dataset: XLSX.WorkBook, datasetPages: string[]) {
  const regions = [];

  for (let i = 0; i < datasetPages.length; i++) {
    if (
      datasetPages[i].includes('Раздел') ||
      datasetPages[i] === 'статистика по годам'
    ) {
      continue;
    }
    const page = dataset.Sheets[datasetPages[i]];

    const aColumn = [];
    for (const el in page) {
      if (el.includes('A') && el !== 'A1') {
        if (!regions.includes(page[el].v)) regions.push(page[el].v);
      }
    }
  }

  return regions;
}
function returnAllTitle(dataset: XLSX.WorkBook, datasetPages: string[]) {
  const titles = [];

  for (let i = 0; i < datasetPages.length; i++) {
    if (
      datasetPages[i].includes('Раздел') ||
      datasetPages[i] === 'статистика по годам'
    ) {
      continue;
    }
    const page = dataset.Sheets[datasetPages[i]];

    const aRow = [];
    for (const el in page) {
      if (el.includes('1') && el.length === 2) {
        if (!titles.includes(page[el].v)) titles.push(page[el].v);
      }
    }
  }

  return titles;
}

export async function parserToFirstSection(
  dataset: XLSX.WorkBook,
  page: string,
) {
  const datasetPages = [page || 'Р1'];
  const regions = returnAllRegions(dataset, datasetPages);
  const titles = returnAllTitle(dataset, datasetPages);
  const stopColumn = String.fromCharCode('A'.charCodeAt(0) + titles.length);
  const everyColumnOfTable = [];
  for (let i = 0; i < titles.length; i++) {
    everyColumnOfTable.push(String.fromCharCode('A'.charCodeAt(0) + i));
  }
  // console.log('stop', stopColumn);
  // console.log(everyColumnOfTable);

  for (let i = 0; i < datasetPages.length; i++) {
    if (
      datasetPages[i].includes('Раздел') ||
      datasetPages[i] === 'статистика по годам'
    ) {
      continue;
    }
    const page = Object.entries(dataset.Sheets[datasetPages[i]]);
    const newArray = [];
    let counterString = 2;
    let counterColumn = 0;
    let cell = everyColumnOfTable[counterColumn] + counterString;
    for (let j = 0; j < 200; j++) {
      const element = page[j];
      if (
        element[0].includes('!') ||
        titles.includes(element[1].v) ||
        element[0].includes(stopColumn)
      ) {
        continue;
      }
      if (
        element[0].includes(stopColumn) ||
        counterColumn >= everyColumnOfTable.length
      ) {
        counterString++;
        counterColumn = 0;
        cell = everyColumnOfTable[counterColumn] + counterString;
      }
      // console.log(
      //   cell,
      //   element[0],
      //   counterColumn,
      //   everyColumnOfTable[counterColumn],
      // );
      if (cell != element[0]) {
        console.log(cell, element[0]);
        newArray.push(0);
        counterColumn++;
      }

      newArray.push(element[1].v);

      if (
        element[0].includes(stopColumn) ||
        counterColumn >= everyColumnOfTable.length
      ) {
        counterString++;
        counterColumn = 0;
        cell = everyColumnOfTable[counterColumn] + counterString;
      }

      counterColumn++;
      cell = everyColumnOfTable[counterColumn] + counterString;
    }

    const mainArray = parser(titles, newArray);
    // console.log(mainArray);
    // console.log(titles, newArray);

    return mainArray;
  }
}

export async function parseFromYearStatistic(dataset: XLSX.WorkBook) {
  const datasetPages = Object.keys(dataset.Sheets);
  for (let i = 0; i < datasetPages.length; i++) {
    if (datasetPages[i] === 'статистика по годам') {
      const page = dataset.Sheets[datasetPages[i]];
      const array = Object.entries(page);
      const arrayColumnsName = ['Factor'];
      const newArray = [];
      for (const el in array) {
        const element = array[el];
        if (
          element[0][1] === '1' &&
          element[0].length === 2 &&
          !arrayColumnsName.includes(element[1].v)
        ) {
          arrayColumnsName.push(element[1].v);
          continue;
        }
        if (
          element[0] === '!ref' ||
          element[0] === '!margins' ||
          element[0][0] === 'A'
        ) {
          continue;
        }
        newArray.push(element[1].v);
      }

      const mainArray = parser(arrayColumnsName, newArray);
      return mainArray;
    }
  }
}
