
// diet
const dietParameter = new Map([
    ["omnivore", 1.837],
    ["flexitarian", 1.495],
    ["vegetarian", 1.380],
    ["vegan", 1.124]
]);

// // mobility
// const flightParameter = new Map([
//     ["short", new Map([
//         ["co2", 0.5]])
//     ],
//     ["medium", new Map([
//         ["co2", 2]
//         ])
//     ],
//     ["long", new Map([
//         ["co2", 7],
//         ])
//     ]
// ]);

// // home heating 
// const heatingCostsPerUnit = new Map([
//     ["oil", 0.087],
//     ["gas", 0.091],
//     ["electric", 0.21],
//     ["heat-pump", 0.21],
//     ["wood", 0.08],
//     ["district-heating", 0.1],
//     ["unknown", 0.21]
// ]);

// const heatingEfficiency = new Map([
//     ["oil", 0.80],
//     ["gas", 0.90],
//     ["electric", 1.00],
//     ["heat-pump", 3.00],
//     ["wood", 0.85],
//     ["district-heating", 1.0],
//     ["unknown", 1.00]
// ]);

// functions go here
function getStartingTotal(surveySettings) {
    var evaluatorSettings = buildEvaluatorSettings(surveySettings);
    return calculateActualValues(evaluatorSettings);
}

function buildEvaluatorSettings(surveySettings) {
    evaluatorSettings = {
        // global settings
        enableDebug: surveySettings.enableDebug,
        language: surveySettings.language,
        locale: surveySettings.locale,
        hiddenTextSelector: surveySettings.hiddenTextSelector,
        
        // houseType: surveySettings.houseType,
        // houseStandard: surveySettings.houseStandard,
        // houseSize: surveySettings.houseSize,
        // heatingType: surveySettings.heatingType,

        // shortFlights: {
        //     selected: false,
        //     enabled: true,
        //     visible: surveySettings.numShortFlights > 0,
        //     numShortFlights: surveySettings.numShortFlights,
        //     select: 1,
        //     investment: "",
        //     annual: "",
        // },

        // mediumFlights: {
        //     selected: false,
        //     enabled: true,
        //     visible: surveySettings.numMediumFlights > 0,
        //     numMediumFlights: surveySettings.numMediumFlights,
        //     select: 1,
        //     investment: "",
        //     annual: "",
        // },

        // longFlights: {
        //     selected: false,
        //     enabled: true,
        //     visible: surveySettings.numLongFlights > 0,
        //     numLongFlights: surveySettings.numLongFlights,
        //     select: 1,
        //     investment: "",
        //     annual: "",
        // },

        diet: {
            selected: false,
            enabled: true,
            visible: true,
            diet: surveySettings.diet,
            selectDiet: surveySettings.diet,
            investment: "",
            annual: "",
        }
    }

    // evaluatorSettings.initialHouse = calculateHouse(evaluatorSettings);
    evaluatorSettings.initialDiet = calculateDiet(evaluatorSettings);
    // evaluatorSettings.initialMobility = calculateMobility(evaluatorSettings);

    return evaluatorSettings;
}

function calculateActualValues(settings) {
    var actualDiet = calculateDiet(settings);
    var actualTotal = actualDiet;
    var actual = {
        actualDiet,
        actualTotal
    }
    return actual;
    // var actualMobility = calculateMobility(settings);
    // var actualHouse = calculateHouse(settings);
    // var actualCertificate = calculateCertificate(settings);
    
    // // var actualHouseWithCertificate = actualHouse * ( 1 - actualCertificate / actualTotal);
    // var actualDietWithCertificate = actualDiet * ( 1 - actualCertificate / actualTotal);
    // var actualMobilityWithCertificate = actualMobility * ( 1 - actualCertificate / actualTotal);
    // var actualTotal = actualDietWithCertificate + actualHouseWithCertificate + actualMobilityWithCertificate;
    // actualHouse,
    // actualMobility,
    // actualCertificate,
    // actualHouseWithCertificate,
    // actualDietWithCertificate,
    // actualMobilityWithCertificate,
}