import * as XLSX from 'xlsx';

export function setNullAsZero(dataset: XLSX.WorkBook, datasetPages: string) {
  // console.log(dataset);

  const titles = returnAllTitle(dataset, [datasetPages]);
  const sheet_name_list = dataset.SheetNames;
  let jsonPagesArray = [];
  sheet_name_list.forEach(function (sheet) {
    if (sheet === datasetPages) {
      const jsonPage = {
        content: XLSX.utils.sheet_to_json(dataset.Sheets[sheet], {
          defval: 0,
        }),
      };
      jsonPagesArray.push(jsonPage);
    }
  });
  jsonPagesArray[0].content.forEach((el) => {
    for (const key in el) {
      if (key.includes('__')) delete el[key];
    }
  });
  return jsonPagesArray[0].content;
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

export function returnAllRegions(
  dataset: XLSX.WorkBook,
  datasetPages: string[],
) {
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
export function returnAllTitle(dataset: XLSX.WorkBook, datasetPages: string[]) {
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

export async function parseToSectionV2(dataset: XLSX.WorkBook, page: string) {
  const datasetPages = page ? [page] : ['Р1'];
  const pages = page ? page : 'Р1';
  const filledDataset = setNullAsZero(dataset, pages);
  const regions = returnAllRegions(dataset, datasetPages);
  const titles = returnAllTitle(dataset, datasetPages);
  // console.log(regions);
  // console.log(titles);

  // filledDataset.forEach((element) => {
  //   for (const key in element) {
  //     if (!titles.includes(key)) {
  //       delete element[key];
  //     }
  //   }
  // });
  return filledDataset;
}

export async function parserToFirstSection(
  dataset: XLSX.WorkBook,
  page: string,
) {
  const datasetPages = [page || 'Р1'];
  const filledDataset = setNullAsZero(dataset, page);
  const regions = returnAllRegions(dataset, datasetPages);
  const titles = returnAllTitle(dataset, datasetPages);
  const stopColumn = String.fromCharCode('A'.charCodeAt(0) + titles.length);
  const everyColumnOfTable = [];
  for (let i = 0; i < titles.length; i++) {
    everyColumnOfTable.push(String.fromCharCode('A'.charCodeAt(0) + i));
  }

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
    for (let j = 0; j < page.length; j++) {
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
      if (cell != element[0]) {
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
