/*
Prepared by: Hoang-Nam Chu
References: ETH Zurich Swiss Panel

I've prepared this code with the help of the ETH Zurich source code that I've attached in this repository. I'll be commenting relevant data structures to explain the purpose of the code.
*/

/*

Below are data structures that define the greenhouse gas emissions (GHG) for four different class of activities:

1) Diet, 
2) Flight,
3) Ground Transportation (Mobility),
4) Home Heating

Note that units have been somewhat standardized. 
For example, the dietParameter map defines diet-choice-ghg emissions pairs in tonnage. The rest follows suits. 


*/
const dietParameter = new Map([
    ["omnivore", 1.837],
    ["flexitarian", 1.495],
    ["vegetarian", 1.380],
    ["vegan", 1.124]
]);

const flightParameter = new Map([
    ["short", 0.5],
    ["medium", 2],
    ["long", 7]]);


/* 

The carParameter map is a nested map that captures both the size of the vehicle and its type of engine. Petrol and small represents a small vehicle and so forth. 

The data structure could have been different but I kept the original data structure from ETH Zurich's source code. In their code, they had different attributes that defined the carParameter that I removed for the purpose of the project. 

*/
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

// Everything after this follows the same pattern. 
const ptParameter = new Map([
    ["train", 0.08 ],
    ["tram", 0.08 ],
    ["bus", 0.08 ]
]);

const heatingTypeParameter = new Map([
    ["oil", 2.65],
    ["gas", 2.25],
    ["electric", 1.28],
    ["heat-pump", 1.28],
    ["wood", 0.01],
    ["district-heating", 0.01],
    ["unknown", 2.65]
]);

const heatingEfficiency = new Map([
    ["oil", 0.80],
    ["gas", 0.90],
    ["electric", 1.00],
    ["heat-pump", 3.00],
    ["wood", 0.85],
    ["district-heating", 1.0],
    ["unknown", 0.80] 
]);

const houseStandardParameter = new Map([
    ["old", 120],
    ["renovated", 60],
    ["new", 40],
    ["minergie", 20]
]);

/* All functions come after to calculate the GHG emissions
*/


function calculateActualValues(settings) {

    var actualDiet = calculateDiet(settings);
    var actualMobility = calculateMobility(settings);
    var actualFlight = calculateFlight(settings);
    var actualHouse = calculateHouse(settings);
    var actualTotal = actualDiet + actualMobility + actualFlight+ actualHouse;
    var actual = {
        actualDiet,
        actualMobility,
        actualFlight,
        actualHouse,
        actualTotal    
    };
    return actualTotal;
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
function calculateHouse(houseSettings) {
    var houseStandard = houseStandardParameter.get(houseSettings.houseStandard);
    var heatingType = heatingTypeParameter.get(houseSettings.heatingType)/10;
    var energyUse = houseSettings.houseSize * houseStandard * heatingType/ heatingEfficiency.get(houseSettings.heatingType)/1000;

    return energyUse;
}

function calculateFlight(flightSettings) {
    let flightsValue = 0;

    let numShortFlights = flightSettings.shortFlights.numShortFlights;
    let numMediumFlights = flightSettings.mediumFlights.numMediumFlights;
    let numLongFlights = flightSettings.longFlights.numLongFlights;

    if (flightSettings.shortFlights.selected) {
        numShortFlights -= flightSettings.shortFlights.select;
    }
    if (flightSettings.mediumFlights.selected) {
        numMediumFlights -= flightSettings.mediumFlights.select;
    }
    if (flightSettings.longFlights.selected) {
        numLongFlights -= flightSettings.longFlights.select;
    }

    flightsValue += numShortFlights * flightParameter.get("short");
    flightsValue += numMediumFlights * flightParameter.get("medium");
    flightsValue += numLongFlights * flightParameter.get("long");
    
    return flightsValue;
 
}

/*
Everything after this is used to recode the Qualtrics responses so that the GHG emissions can be calculated. 
*/

function getDiet(val) {
    let diet = ['', 'omnivore', 'flexitarian', 'vegetarian', 'vegan'];
    let choice = extractSelectedChoices(val);
    return diet[choice];
}

function getNbFlights(valNbFlightsTotal, valNbFlights) {
    let totalChoice = extractSelectedChoices(valNbFlightsTotal); // 0 if no, 1 if yes
    return (totalChoice != 0) ? parseInt(valNbFlights) : 0;
}

function getOwnsCar(val) {
    let choices = extractSelectedChoices(val, true); // extract the selected choices from the string (as array)
    return choices[0] == 1;
}

function getCarAccess(val) {
    return extractSelectedChoices(val) == 1;
}

function getFuelType(val) {
    let fuels = ['', 'petrol', 'diesel', 'bev', 'phev'];
    let choice = extractSelectedChoices(val);
    return fuels[choice];
}

function getCarSize(val) {
    let size = ['', 'small', 'medium', 'large'];
    let choice = extractSelectedChoices(val);
    return size[choice];
}

function getCar(valFuel, valSize) {
    let fuelType = getFuelType(valFuel);
    let carSize = getCarSize(valSize);
    getFuelType(valFuel) + "-" + getCarSize(valSize);
    if(fuelType == '' && carSize == '') {
        return "";
    } 
    return fuelType + "-" + carSize;
}

function getPtKm(valUsesPt, valPtKm) {
    console.log("getPtKm inputs:", valUsesPt, valPtKm);
    let useChoice = extractSelectedChoices(valUsesPt);
    let result = (useChoice != 0) ? parseIntOrZero(valPtKm) : 0; 
    console.log("getPtKm output:", result);
    return result;
}
function getHouseSize(val) {
    let size = parseIntOrZero(val);
    return size < 1 ? 1 : size;
}
function getHouseType(val) {
    // 1-based index (1,2,3)
    let type = ['', 'flat', 'detached', 'semi-detached'];
    let choice = extractSelectedChoices(val);
    return type[choice];
}
function getResidenceStandard(val) {
    // 1-based index (1,2,3,4)
    let standard = ['', 'old', 'renovated', 'new', 'minergie'];
    let choice = extractSelectedChoices(val);
    return standard[choice];
}
function getHeatingType(val) {
    // 1-based index (1,2,3,4,5,6,7)
    let heating = ['', 'oil', 'electric', "wood", "gas", "heat-pump", "district-heating", "unknown"]
    let choice = extractSelectedChoices(val);
    return heating[choice];
}

function extractSelectedChoices(answer, forceReturnArray = false) {
    // If answer is null, undefined, or an empty string, return 0 (or [0] if an array is forced).
    if (!answer || answer === "") {
         return forceReturnArray ? [0] : 0;
    }
    let NO_ANSWER = 0;
    var indices = [];
    if (answer === "") {
        indices.push(NO_ANSWER);
    } else {
        while(answer.includes(",")) {
            indices.push(parseInt(answer.charAt(0)));
            answer = answer.substring(3);
        }
        indices.push(parseInt(answer.charAt(0)));
    }
    if (indices.length === 1 && !forceReturnArray) {
        return indices[0];
    } else {
        return indices;
    }
}


function parseIntOrZero(answer) {
    // Trim the answer to remove extra whitespace
    let trimmed = answer ? answer.trim() : "";
    let parsed = parseInt(trimmed);
    return isNaN(parsed) ? 0 : parsed;
}

function formatSurveySettings(data) {
    var surveySettings = {
        hasAccessToCar: getCarAccess(data.q1),
        ownsCar: getOwnsCar(data.q2),
        car: getCar(data.q3, data.q4),
        carKilometrageYearly: parseIntOrZero(data.q5),
        trainKilometrageWeekly: getPtKm(data.q6, data.q7),
        tramKilometrageWeekly: 0,
        busKilometrageWeekly: 0,
        numShortFlights: getNbFlights(data.q8, data.q9),
        numMediumFlights: getNbFlights(data.q8, data.q10),
        numLongFlights: getNbFlights(data.q8, data.q11),
        diet: getDiet(data.q12),
        houseType: getHouseType(data.q13),      // flat, detached, semi-detached
        houseStandard: getResidenceStandard(data.q14),     // old, renovated, new, minergie
        houseSize: getHouseSize(data.q15),
        heatingType: getHeatingType(data.q16),             // oil, gas, electric, heat-pump, wood
    };

    return surveySettings;
}

