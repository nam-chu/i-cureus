
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

const carParameter = new Map([
    ["petrol-small", new Map([
        ["co2", 235]
        ])
    ],
    ["petrol-medium", new Map([
        ["co2", 245]
        ])
    ],
    ["petrol-large", new Map([
        ["co2", 270]
        ])
    ],
    ["diesel-medium", new Map([
        ["co2", 245]
        ])
    ],
    ["diesel-large", new Map([
        ["co2", 285]
        ])
    ],
    ["phev-medium", new Map([
        ["co2", 180]
        ])
    ],
    ["phev-large", new Map([
        ["co2", 270]
        ])
    ],
    ["bev-small", new Map([
       ["co2", 50]
       ])
    ],
    ["bev-medium", new Map([
       ["co2", 50]
       ])
    ],
    ["bev-large", new Map([
       ["co2", 55]
       ])
   ]
]);

const ptParameter = new Map([
    ["train", 0.08 ],
    ["tram", 0.08 ],
    ["bus", 0.08 ]
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
            diet: surveySettings.diet,
            selectDiet: surveySettings.diet
        },
        shortFlights: {
            selected: false,
            visible: surveySettings.numShortFlights > 0,
            numShortFlights: surveySettings.numShortFlights,
            select: 1
        },
        mediumFlights: {
            selected: false,
            // enabled: true,
            visible: surveySettings.numMediumFlights > 0,
            numMediumFlights: surveySettings.numMediumFlights,
            select: 1,
        },

        longFlights: {
            selected: false,
            // enabled: true,
            visible: surveySettings.numLongFlights > 0,
            numLongFlights: surveySettings.numLongFlights,
            select: 1
        },
        reduceKilometrageCar: {
            selected: false,
            // enabled: true,
            visible: surveySettings.hasAccessToCar,
            carKilometrageYearly: surveySettings.carKilometrageYearly,
            select: 1.0
        },
        compensateKilometrageCarByNone: {
            // enabled: true,
            visible: surveySettings.hasAccessToCar,
            compensatedKilometrageYearly: 0.0,
            select: 0.0,
        },
        replaceCar: {
            selected: false,
            // enabled: true,
            visible: surveySettings.ownsCar,
            car: surveySettings.car,
            selectCar: surveySettings.car,
        },
        actualCar: surveySettings.car,

        trainKilometrageWeekly: surveySettings.trainKilometrageWeekly,
        tramKilometrageWeekly: surveySettings.tramKilometrageWeekly,
        busKilometrageWeekly: surveySettings.busKilometrageWeekly
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
    let mobility = 0;
    let flightsValue = 0;

    let numShortFlights = mobilitySettings.shortFlights.numShortFlights;
    let numMediumFlights = mobilitySettings.mediumFlights.numMediumFlights;
    let numLongFlights = mobilitySettings.longFlights.numLongFlights;

    if (mobilitySettings.shortFlights.selected) {
        numShortFlights -= mobilitySettings.shortFlights.select;
    }
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

    if (mobilitySettings.replaceCar && mobilitySettings.replaceCar.car != "") {
        let carInfo = carParameter.get(mobilitySettings.replaceCar.car);
        let carKilometrage = mobilitySettings.reduceKilometrageCar.carKilometrageYearly;
        let carCo2 = carInfo.get("co2");
        // Assume carCo2 is in grams per km; convert to tons per year:
        let carEmissions = carCo2 * carKilometrage / 1_000_000;
        mobility += carEmissions;
    }

    let ptValue = 0;

// Ensure the weekly kilometrage values default to 0 if they are empty or undefined.
    let trainKm = parseFloat(mobilitySettings.trainKilometrageWeekly) || 0;
    let tramKm  = parseFloat(mobilitySettings.tramKilometrageWeekly) || 0;
    let busKm   = parseFloat(mobilitySettings.busKilometrageWeekly) || 0;

    ptValue += ptParameter.get("train") * trainKm * 52 / 1000;
    ptValue += ptParameter.get("tram")  * tramKm  * 52 / 1000;
    ptValue += ptParameter.get("bus")   * busKm   * 52 / 1000;
    mobility += ptValue;

    return mobility;
}


