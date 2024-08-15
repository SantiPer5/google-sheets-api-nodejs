const { google } = require("googleapis");
//
function NodeGoogleSheets(file, sheetId, keyMass, fun) {
  const auth = new google.auth.GoogleAuth({
    keyFile: file,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  //
  (async () => {
    const client = await auth.getClient();
    //
    const googleSheets = google.sheets({ version: "v4", auth: client });
    //
    const spreadsheetId = sheetId;
    //
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
    //
    const data = {
      auth,
      spreadsheetId,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: keyMass.change,
      },
    };
    //
    if (keyMass.append) {
      data["range"] = keyMass.append;
      //
      const append = await googleSheets.spreadsheets.values.append(data);
      //
      fun(append);
    } else if (keyMass.values) {
      data["range"] = keyMass.values;
      //
      delete data.valueInputOption;
      delete data.resource;
      //
      const values = await googleSheets.spreadsheets.values.get(data);
      //
      fun(values);
    } else if (keyMass.update) {
      data["range"] = keyMass.update;
      //
      const update = await googleSheets.spreadsheets.values.update(data);
      //
      fun(update);
    }
  })();
}
//
/* NodeGoogleSheets('src/json/google-key-sheets.json', '1JVSxs3-mOrJ74LyydZyUKa-qOrrjPlavDorFLZ-mSAk', {values: ['A1:Z1000']}, (data) => {
	console.log(data.data);
}) */

//Funcion para buscar en una hoja de calculo,
async function searchAndFetchRow(queryParams, queryValue) {
  //autenticacion
  const auth = new google.auth.GoogleAuth({
    keyFile: "src/json/google-key-sheets.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  //obtener cliente
  const client = await auth.getClient();

  //obtener hoja de calculo
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "18_jOAKiEWw0GND3vlq0x-X9pPugDhfkRGq8L1WTSUgU";
  const range = "A:Z";
  const values = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = values.data.values;

  if (!rows.length) {
    console.log("No data found.");
  }

  //Encuentra la columna de la busqueda
  const header = rows[0];
  const columnIndex = header.indexOf(queryParams);

  if (columnIndex === -1) {
    console.log(`Column ${queryParams} not found.`);
    return;
  }

  //Busca el valor de la busqueda

  /* 
	for(let i = 1; i < rows.length; i++) {
		if(rows[i][columnIndex] === queryValue) {
			callback(rows[i]);
			return;
		}
	}

	console.log(`Value ${queryValue} not found.`); */

  // Recolecta todas las filas que contienen el valor buscado como subcadena
  const matchingRows = [];
  for (let i = 1; i < rows.length; i++) {
    if (
      rows[i][columnIndex] &&
      rows[i][columnIndex].toLowerCase().includes(queryValue.toLowerCase())
    ) {
      // Convierte cada fila en un objeto usando los encabezados como claves
      const rowObject = {};
      header.forEach((headerName, index) => {
        rowObject[headerName] = rows[i][index] || ""; // Maneja valores faltantes
      });
      matchingRows.push(rowObject);
    }
  }

  // Llama a la función de callback con las filas encontradas
  /* if (matchingRows.length > 0) {
    callback(matchingRows);
  } else {
    console.log("Value not found.");
  } */
  /* 	console.log(header)
	console.log(matchingRows) */
  // Devuelve los datos en formato JSON
  return matchingRows;
}

/* searchAndFetchRow("MarcaModelo", "sf 888").then((data) => {
  console.log(data);
}); */

module.exports = {
  NodeGoogleSheets,
	searchAndFetchRow,
};
