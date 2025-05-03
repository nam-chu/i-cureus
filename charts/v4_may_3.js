Qualtrics.SurveyEngine.addOnReady(function() {
  console.log("GHG Footprint script started.");

  // ===== Step 1: Survey answers from piped text =====
  var qData = {
    q1 : '${q://QID123/SelectedChoicesRecode}',
    q2 : '${q://QID1/SelectedChoicesRecode}',
    q3 : '${q://QID2/SelectedChoicesRecode}',
    q4 : '${q://QID3/SelectedChoicesRecode}',
    q5 : '${q://QID4/ChoiceNumericEntryValue/1}',
    q6 : '${q://QID5/SelectedChoicesRecode}',
    q7 : '${q://QID201/ChoiceTextEntryValue}',
    q8 : '${q://QID10/SelectedChoicesRecode}',
    q9 : '${q://QID12/ChoiceTextEntryValue}',
    q10 : '${q://QID13/ChoiceTextEntryValue}',
    q11 : '${q://QID14/ChoiceTextEntryValue}',
    q12 : '${q://QID21/SelectedChoicesRecode}',
    q13 : '${q://QID35/SelectedChoicesRecode}',
    q14 : '${q://QID23/SelectedChoicesRecode}',
    q15 : '${q://QID25/ChoiceTextEntryValue}',
    q16 : '${q://QID26/SelectedChoicesRecode}'
  };

  console.log("Piped values:", qData);

  var peData = formatSurveySettings(qData);
  var total = getStartingTotal(peData);

  var userDiet = +total.actualDiet.toFixed(2);
  var userMobility = +total.actualMobility.toFixed(2);
  var originalFlight = +total.actualFlight.toFixed(2);
  var userHouse = +total.actualHouse.toFixed(2);

  var hasFlown = originalFlight > 0;
  var simulatedLongFlight = 7.0;
  var displayedFlight = hasFlown ? originalFlight : 0;

  var globalAverage = 5.2;
  var sustainableTarget = 3.0;
  var ctx = document.getElementById("carbonChartComparison").getContext("2d");

  function getYMax() {
    // Estimate max with an added long-haul flight, plus buffer
    let max = userDiet + userMobility + userHouse + originalFlight + simulatedLongFlight;
    return Math.ceil(max + 1);
  }

  var chartCombined = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Your Emissions", "Global Average", "Sustainable Target"],
      datasets: [
        { label: "Diet", data: [userDiet, 0, 0], backgroundColor: "rgba(217, 155, 253, 0.8)" },
        { label: "Mobility", data: [userMobility, 0, 0], backgroundColor: "rgba(158, 195, 255, 0.8)" },
        { label: "Flight", data: [displayedFlight, 0, 0], backgroundColor: "rgba(255,205,86,0.8)" },
        { label: "House", data: [userHouse, 0, 0], backgroundColor: "rgba(112, 128, 144, 0.8)" },
        { label: "Global Average", data: [0, globalAverage, 0], backgroundColor: "#4caf50" },
        { label: "Sustainable Target", data: [0, 0, sustainableTarget], backgroundColor: "#8bc34a" }
      ]
    },
    options: {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true,
            max: getYMax(),
            callback: function(value) { return value + " t"; },
            fontColor: "#333"
          },
          scaleLabel: {
            display: true,
            labelString: "t CO₂/year",
            fontColor: "#333"
          },
          gridLines: { color: "rgba(0,0,0,0.1)" }
        }]
      },
      legend: {
        position: "bottom",
        onClick: function() { return; },
        labels: { fontColor: "#333" }
      },
      title: {
        display: true,
        text: "Comparison: Your Emissions vs. Global & Sustainable Targets",
        fontColor: "#333"
      }
    }
  });

  function updateFootprintTotal(newFlight) {
    const newTotal = +(userDiet + userMobility + userHouse + newFlight).toFixed(2);
    jQuery("#footprint").html(newTotal.toFixed(1) + " t CO<sub>2</sub>/year");
  }

  updateFootprintTotal(displayedFlight);

  jQuery('input[name="flightToggle"]').change(function() {
    const selection = jQuery(this).val();
    let newFlight;

    if (selection === "with") {
      newFlight = hasFlown ? originalFlight : 0;
    } else if (selection === "additional") {
      newFlight = +(originalFlight + simulatedLongFlight).toFixed(2);
    } else if (selection === "without") {
      newFlight = 0;
    }

    chartCombined.data.datasets[2].data[0] = newFlight;
    updateFootprintTotal(newFlight);
    chartCombined.update();

    console.log("Flight option:", selection, "| New flight total:", newFlight);
  });
});
