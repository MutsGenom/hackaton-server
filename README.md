## Не забудь звезду

### Запуск

#### npm run start:dev

Запуск в development-режиме, для разработчиков

#### npm run start

Запуск в production-режиме, для отлаженного и готового решения

### API

#### @POST /dataset/

@Body {

extension: string (example: "xlsx") without dot,

UploadedFile

}
@Response {

(converted) fileName: string (example:
"c08dd52e-b96e-4b10-99a7-8acbb5c6f7a4.xlsx")

}

#### @GET /dataset/:fileName

@Params {

filename: string (example: "c08dd52e-b96e-4b10-99a7-8acbb5c6f7a4.xlsx")

}

@Response {

file: Buffer

}

#### @GET /dataset/:fileName/:readAs

@Params {

filename: string (example: "c08dd52e-b96e-4b10-99a7-8acbb5c6f7a4.xlsx"),

readAs: string (example: "xlsx", "csv")

}

@Response {

readFullFile: Promise<Object || Array> || XLSX.WorkBook

}

#### @GET /dataset/page/:fileName/:readAs/:page

@Param {

fileName: string (example: "c08dd52e-b96e-4b10-99a7-8acbb5c6f7a4.xlsx"),

readAs: string (example: "yearsStat", "regions", 'title'),

page: string (example: "Р1", "1.2.2.")

}

@Response {

parsedFile: Promise<Object || Array>

}

#### @GET /dataset/:fileName/test

@Param {

}

##

#### docker-compose up
