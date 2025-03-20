
// Start by declaring relevant data structures

// Diet
const dietParameter = new Map([
    ["omnivore", 1.837],
    ["flexitarian", 1.495],
    ["vegetarian", 1.380],
    ["vegan", 1.124]
]);

const flightParameter = new Map([
    ["short", new Map([
        ["co2", 0.5]
        ])
    ],
    ["medium", new Map([
        ["co2", 2]
        ])
    ],
    ["long", new Map([
        ["co2", 7]
        ])
    ]
]);

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

        diet: {
            selected: false,
            enabled: true,
            visible: true,
            diet: surveySettings.diet,
            selectDiet: surveySettings.diet
        },
        shortFlights: {
            selected: false,
            enabled: true,
            visible: surveySettings.numShortFlights > 0,
            numShortFlights: surveySettings.numShortFlights,
            select: 1
        },
        mediumFlights: {
            selected: false,
            enabled: true,
            visible: surveySettings.numMediumFlights > 0,
            numMediumFlights: surveySettings.numMediumFlights,
            select: 1,
        },

        longFlights: {
            selected: false,
            enabled: true,
            visible: surveySettings.numLongFlights > 0,
            numLongFlights: surveySettings.numLongFlights,
            select: 1
        }
    };

    evaluatorSettings.initialMobility = calculateMobility(evaluatorSettings);
    evaluatorSettings.initialDiet = calculateDiet(evaluatorSettings);
    return evaluatorSettings;
}

function calculateActualValues(settings) {

    var actualDiet = calculateDiet(settings);
    var actualMobility = calculateMobility(settings);
    var actualTotal = actualDiet + actualMobility;
    var actual = {
        actualDiet,
        actualMobility,
        actualTotal    
    };
    return actual;
}

function calculateDiet(dietSettings) {
    if (dietSettings.diet.selected) {
        var value = dietParameter.get(dietSettings.diet.selectDiet);
        if (value == null) {
            console.log("Unknown diet option selected: " + dietSettings.diet);
            return 0;
        } else return value;
    } else {
        return dietParameter.get(dietSettings.diet.diet);
    }
}

function calculateMobility(mobilitySettings) {

    flightsValue = 0;
    numShortFlights = mobilitySettings.shortFlights.numShortFlights;
    numMediumFlights = mobilitySettings.mediumFlights.numMediumFlights;
    numLongFlights = mobilitySettings.longFlights.numLongFlights;
    var mobility = 0;
    
    if (mobilitySettings.shortFlights.selected) {
        numShortFlights -= mobilitySettings.shortFlights.select;  
    } 
    numShortFlights = mobilitySettings.shortFlights.numShortFlights;
    if (mobilitySettings.mediumFlights.selected) {
        numMediumFlights -= mobilitySettings.mediumFlights.select;
    }
    if (mobilitySettings.longFlights.selected) {
            numLongFlights -= mobilitySettings.longFlights.select;
    }
    flightsValue += numShortFlights * flightParameter.get("short").get("co2");
    flightsValue += numMediumFlights * flightParameter.get("medium").get("co2");
    flightsValue += numLongFlights * flightParameter.get("long").get("co2");
    mobility += flightsValue;
    return mobility;
}

