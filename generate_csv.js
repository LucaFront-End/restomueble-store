const fs = require('fs');

const header = "handle,fieldType,name,visible,plainDescription,media,mediaAltText,ribbon,brand,price,strikethroughPrice,baseUnit,baseUnitMeasurement,totalUnits,totalUnitsMeasurement,cost,inventory,preOrderEnabled,preOrderMessage,preOrderLimit,sku,barcode,weight,productOptionName1,productOptionType1,productOptionChoices1,productOptionName2,productOptionType2,productOptionChoices2,productOptionName3,productOptionType3,productOptionChoices3,productOptionName4,productOptionType4,productOptionChoices4,productOptionName5,productOptionType5,productOptionChoices5,productOptionName6,productOptionType6,productOptionChoices6,modifierName1,modifierType1,modifierCharLimit1,modifierMandatory1,modifierDescription1,modifierName2,modifierType2,modifierCharLimit2,modifierMandatory2,modifierDescription2,modifierName3,modifierType3,modifierCharLimit3,modifierMandatory3,modifierDescription3,modifierName4,modifierType4,modifierCharLimit4,modifierMandatory4,modifierDescription4,modifierName5,modifierType5,modifierCharLimit5,modifierMandatory5,modifierDescription5,modifierName6,modifierType6,modifierCharLimit6,modifierMandatory6,modifierDescription6,modifierName7,modifierType7,modifierCharLimit7,modifierMandatory7,modifierDescription7,modifierName8,modifierType8,modifierCharLimit8,modifierMandatory8,modifierDescription8,modifierName9,modifierType9,modifierCharLimit9,modifierMandatory9,modifierDescription9,modifierName10,modifierType10,modifierCharLimit10,modifierMandatory10,modifierDescription10";

const numColumns = header.split(',').length;

const products = [
    { name: "Silla Solera", desc: "Terminados: Pintada (negro o chocolate) o cromo. Estructura metálica cal. 20 con asiento acojinado o rodete de madera.", price: 1500, weight: 5 },
    { name: "Silla Chabeli", desc: "Terminados: Cromo o pintada (negro o chocolate). Estructura metálica cal. 20 con asiento acojinado o rodete de madera.", price: 1500, weight: 5 },
    { name: "Silla Italia", desc: "Terminados: Pintada (negro o chocolate) o cromo. Estructura metálica cal. 18 con asiento acojinado o rodete de madera.", price: 1600, weight: 6 },
    { name: "Silla Roma", desc: "Terminado: Pintada (negro o chocolate). Estructura metálica cal. 18 con asiento acojinado o rodete de madera.", price: 1400, weight: 5 },
    { name: "Banco Solera", desc: "Terminados: Pintado (negro o chocolate) o cromo. Estructura metálica cal. 20 con asiento acojinado o rodete de madera.", price: 1800, weight: 6 },
    { name: "Banco Chabeli", desc: "Terminados: Pintado (chocolate o negro) o cromo. Estructura metálica cal. 20 con asiento acojinado o rodete de madera.", price: 1800, weight: 6 },
    { name: "Banco Roma", desc: "Terminado: Chocolate o color negro. Estructura metálica cal. 18 con asiento acojinado o rodete de madera.", price: 1700, weight: 6 },
    { name: "Banco Italia", desc: "Terminado: Pintado (negro o chocolate). Estructura metálica cal. 18 con asiento acojinado o rodete de madera.", price: 1900, weight: 7 },
    { name: "Silla Hit", desc: "Estructura tubular de aluminio; asientos de plástico de alta resistencia en 10 colores (rojo, naranja, amarillo, verde, azul rey, azul cielo, café, blanco, gris, negro).", price: 1200, weight: 3 },
    { name: "Silla Tolix", desc: "Estilo industrial, únicamente en color negro; estructura metálica con pintura al horno y apilable.", price: 1300, weight: 4 },
    { name: "Silla Oslo", desc: "Asiento de polipropileno en 7 colores (blanco, gris, negro, azul, amarillo, rosa, lila); estructura metálica cal. 13/16\" negra ensamblada con tornillos.", price: 1400, weight: 4 },
    { name: "Silla Frankfurt", desc: "Estructura de polipropileno con asiento acojinado en 5 colores (blanco, gris, negro, rosa, turquesa); base de postes de madera.", price: 1550, weight: 4 },
    { name: "Silla España", desc: "Estructura metálica cal. 20 con asiento acojinado o rodete de madera.", price: 1450, weight: 5 },
    { name: "Silla Apilable", desc: "Estructura metálica cal. 20 con asiento acojinado.", price: 900, weight: 4 },
    { name: "Banco Ibiza", desc: "Estructura metálica cal. 18 con asiento acojinado.", price: 1600, weight: 6 },
    { name: "Banco Panda", desc: "Estructura metálica cal. 20 con asiento acojinado.", price: 1600, weight: 6 },
    { name: "Banco Pony", desc: "Estructura metálica cal. 20 con asiento acojinado.", price: 1500, weight: 5 },
    { name: "Banco Bali", desc: "Estructura metálica cal. 20 con asiento acojinado.", price: 1700, weight: 6 },
    { name: "Periquera Infantil", desc: "Estructura metálica cal. 18 con asiento acojinado.", price: 1200, weight: 5 },
    { name: "Mesa con canto de PVC", desc: "Cubierta de formaica (variedad de colores); formas cuadrada, redonda o rectangular; pedestal en cromo, negro o chocolate con niveladores.", price: 2500, weight: 15 },
    { name: "Mesa con canto boleado", desc: "Cubierta de formaica en 4 tonos (negro, chocolate, caoba, natural); formas cuadrada o rectangular.", price: 2800, weight: 18 },
    { name: "Mesa alta periquera", desc: "Cubierta de formaica con canto de PVC; formas cuadrada o redonda; pedestal con niveladores y descansapiés.", price: 2900, weight: 16 },
    { name: "Mesa rústica (Vintage)", desc: "Cubierta de madera de pino con terminado barnizado en 4 tonos (obscuro, medio, claro, natural); pedestal estándar o doble.", price: 3500, weight: 20 },
    { name: "Mesas medidas especiales", desc: "Medidas de 1.20m×75cm o 1.50m×75cm; cantos en PVC, media caña boleada o aluminio; pedestal doble o corral de 4 patas.", price: 4000, weight: 25 },
    { name: "Love Seat", desc: "Disponible con respaldo o sin respaldo; largo de 1.20 m.", price: 4500, weight: 25 },
    { name: "Sillón Individual", desc: "Medidas: 40 cm de largo con respaldo de 84 cm de alto.", price: 2200, weight: 12 },
    { name: "Taburete", desc: "Medidas: 40×40×40cm.", price: 1200, weight: 5 },
    { name: "Mesa Lounge", desc: "Cubierta de acrílico; adaptable para luz LED.", price: 2800, weight: 10 },
    { name: "Booth Individual", desc: "Estructura de madera de pino; tapizado en tacto piel sintético o tela; fondo de 0.67 m.", price: 5500, weight: 30 },
    { name: "Booth Doble", desc: "Mismas especificaciones de materiales; fondo de 1.20 m.", price: 8500, weight: 50 },
    { name: "Tablón Rectangular Vidrio", desc: "Estructura metálica plegable con cubierta de vidrio; medida 2.40m×75cm.", price: 3200, weight: 20 },
    { name: "Tablón Rectangular Macocel", desc: "Estructura metálica plegable con cubierta de triplay de macocel; medida 2.40m×75cm.", price: 2800, weight: 18 },
    { name: "Tablón Infantil", desc: "Medida: 1.80m×50cm con 50 cm de altura.", price: 2400, weight: 15 },
    { name: "Silla de Polipropileno", desc: "Plegable, tubular redondo 3/4\" cal. 18; asiento y respaldo en polipropileno negro.", price: 800, weight: 3 },
    { name: "Silla Acojinada Plegable", desc: "Tubular cuadrado cal. 20; estructura cromada con forrado en vinil negro.", price: 950, weight: 4 }
];

let csvContent = header + "\n";

products.forEach(p => {
    const handle = p.name.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const row = new Array(numColumns).fill("");

    row[0] = handle; // handle
    row[1] = "PRODUCT"; // fieldType
    row[2] = p.name; // name
    row[3] = "TRUE"; // visible
    row[4] = `"${p.desc.replace(/"/g, '""')}"`; // plainDescription
    row[5] = "wix:image://v1/placeholder.jpg/file.jpg#originWidth=1000&originHeight=1000"; // media
    row[6] = p.name; // mediaAltText
    row[8] = "Restomueble"; // brand
    row[9] = p.price.toString(); // price
    row[16] = "IN_STOCK"; // inventory
    row[17] = "FALSE"; // preOrderEnabled
    row[20] = handle.toUpperCase(); // sku
    row[22] = p.weight.toString(); // weight

    csvContent += row.join(",") + "\n";
});

fs.writeFileSync('d:/Workspace/Assets/Restomueble ecom/store/wix_products_import.csv', csvContent);
console.log("CSV generated with " + numColumns + " columns per row.");
