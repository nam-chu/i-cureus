
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

const fuelParameter = new Map([
    ["petrol", 1.53],
    ["diesel", 1.54],
    ["phev", 0.21],
    ["bev", 0.21]
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
        },
        reduceKilometrageCar: {
            selected: false,
            enabled: true,
            visible: surveySettings.hasAccessToCar,
            carKilometrageYearly: surveySettings.carKilometrageYearly,
            select: 1.0
        },
        compensateKilometrageCarByNone: {
            enabled: true,
            visible: surveySettings.hasAccessToCar,
            compensatedKilometrageYearly: 0.0,
            select: 0.0
        },
        replaceCar: {
            selected: false,
            enabled: true,
            visible: surveySettings.ownsCar,
            car: surveySettings.car,
            selectCar: surveySettings.car
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
    var mobility = 0;

    flightsValue = 0;
    numShortFlights = mobilitySettings.shortFlights.numShortFlights;
    numMediumFlights = mobilitySettings.mediumFlights.numMediumFlights;
    numLongFlights = mobilitySettings.longFlights.numLongFlights;
    
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

    if (mobilitySettings.replaceCar.car != "") { // only do all this if there is a access to a car
        var existingCar = mobilitySettings.replaceCar.car;
        var carKilometrage = mobilitySettings.reduceKilometrageCar.carKilometrageYearly;
        var variableCostsExistingCar = carKilometrage * carParameter.get(existingCar).get("fuel-consumption") / 100 * carParameter.get(existingCar).get("fuel-price") +
            carKilometrage * carParameter.get(existingCar).get("electricity-consumption") / 100 * carParameter.get(existingCar).get("electricity-price");
        var fixedCostsExistingCar = 2650 + 0.134 * mobilitySettings.sellCar.carValue;

        var actualCar = existingCar;
        var variableCostsActualCar = variableCostsExistingCar;
        var fixedCostsActualCar = fixedCostsExistingCar;
        var actualCarKilometrage = carKilometrage;

        if (!mobilitySettings.sellCar.selected) {
            mobilitySettings.sellCar.investment = "";
            mobilitySettings.sellCar.annual = "";

            if (mobilitySettings.replaceCar.selected) {
                actualCar = mobilitySettings.replaceCar.selectCar;
                variableCostsActualCar = carKilometrage * carParameter.get(actualCar).get("fuel-consumption") / 100 * carParameter.get(actualCar).get("fuel-price") +
                        carKilometrage * carParameter.get(actualCar).get("electricity-consumption") / 100 * carParameter.get(actualCar).get("electricity-price");
                var priceActualCar = carParameter.get(actualCar).get("price");
                fixedCostsActualCar = 2650 + 0.134 * priceActualCar;

                mobilitySettings.replaceCar.investment = priceActualCar - mobilitySettings.sellCar.carValue;
                mobilitySettings.replaceCar.annual = (fixedCostsActualCar - fixedCostsExistingCar) + (variableCostsActualCar - variableCostsExistingCar);

                mobilitySettings.sum.investment += mobilitySettings.replaceCar.investment;
                mobilitySettings.sum.annual += mobilitySettings.replaceCar.annual;
            } else {
                mobilitySettings.replaceCar.investment = "";
                mobilitySettings.replaceCar.annual = "";
            }

            if (mobilitySettings.reduceKilometrageCar.selected) {
                actualCarKilometrage = mobilitySettings.reduceKilometrageCar.carKilometrageYearly * (1 - mobilitySettings.reduceKilometrageCar.select);

               mobilitySettings.reduceKilometrageCar.investment = 0;
               mobilitySettings.reduceKilometrageCar.annual = - variableCostsActualCar * (1 - actualCarKilometrage / carKilometrage);

               mobilitySettings.sum.investment += mobilitySettings.reduceKilometrageCar.investment;
               mobilitySettings.sum.annual += mobilitySettings.reduceKilometrageCar.annual;
            } else {
                mobilitySettings.reduceKilometrageCar.investment = "";
                mobilitySettings.reduceKilometrageCar.annual = "";
            }

            var carCo2 = carParameter.get(actualCar).get("co2");
            var carValue = carCo2 *actualCarKilometrage / 1_000_000;
            mobility += carValue;
        } else { // i.e. we sell the car
            mobilitySettings.sellCar.investment = - mobilitySettings.sellCar.carValue;
            mobilitySettings.sellCar.annual = - fixedCostsActualCar - variableCostsExistingCar;

            mobilitySettings.sum.investment += mobilitySettings.sellCar.investment;
            mobilitySettings.sum.annual += mobilitySettings.sellCar.annual;

            // if we sell the car, we automatically reduce the kilometrage by 100% - all savings are taken into account in the ""sell car"" option
            mobilitySettings.reduceKilometrageCar.investment = "";
            mobilitySettings.reduceKilometrageCar.annual = "";
            mobilitySettings.replaceCar.investment = "";
            mobilitySettings.replaceCar.annual = "";
        }
    }
    return mobility;
}

