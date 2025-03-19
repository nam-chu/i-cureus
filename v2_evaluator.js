
// Start by declaring relevant data structures

// Diet
const dietParameter = new Map([
    ["omnivore", 1.837],
    ["flexitarian", 1.495],
    ["vegetarian", 1.380],
    ["vegan", 1.124]
]);

// Plane 
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
            select: 1}
    };

    evaluatorSettings.initialDiet = calculateDiet(evaluatorSettings);
    evaluatorSettings.initialMobility = calculateMobility(evaluatorSettings);
    return evaluatorSettings;
}

function calculateActualValues(settings) {
    
    var actualMobility = calculateMobility(settings);
    var actualDiet = calculateDiet(settings);
    var actual = {
        actualDiet,
        actualMobility,
        actualTotal
    }
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
    var mobility = 0;
    flightsValue = 0;
    numShortFlights = mobilitySettings.shortFlights.numShortFlights;
    flightsValue += numShortFlights * flightParameter.get("short").get("co2");
    mobility += flightsValue;
    return mobility;
}

