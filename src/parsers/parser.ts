import * as XLSX from 'xlsx';

const parser = (columns, strings) => {
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

export async function parserToRegionData(dataset: XLSX.WorkBook) {
  const datasetPages = Object.keys(dataset.Sheets);
  const regions = returnAllRegions(dataset, datasetPages);
  const titles = returnAllTitle(dataset, datasetPages);
  for (let i = 0; i < datasetPages.length; i++) {
    if (
      datasetPages[i].includes('Раздел') ||
      datasetPages[i] === 'статистика по годам'
    ) {
      continue;
    }
    const page = dataset.Sheets[datasetPages[i]];

    for (const el in page) {
      if (el[0] === 'A' && el !== 'A1') {
        if (!regions.includes(page[el].v)) regions.push(page[el].v);
      }
    }
  }
  return { titles };
}

export async function parseFromYearStatistic(dataset: XLSX.WorkBook) {
  const datasetPages = Object.keys(dataset.Sheets);
  for (let i = 0; i < datasetPages.length; i++) {
    if (datasetPages[i] === 'статистика по годам') {
      const page = dataset.Sheets[datasetPages[i]];
      // console.log(page);
      const array = Object.entries(page);
      // console.log(array);
      const arrayColumnsName = ['Фактор'];
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
      // console.log(mainArray);
      return mainArray;
    }
  }
}
