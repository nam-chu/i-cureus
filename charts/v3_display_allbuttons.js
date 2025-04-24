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

  // ===== Step 2: Format settings + calculate total emissions =====
  var peData = formatSurveySettings(qData);
  console.log("Formatted PE data:", peData);
  Qualtrics.SurveyEngine.setEmbeddedData('PeInput', JSON.stringify(peData));

  var total = getStartingTotal(peData);
  console.log("Computed footprint total:", total);

  // ===== Step 3: Breakdown components =====
  var userDiet = total.actualDiet;
  var userMobility = total.actualMobility;
  var originalFlight = total.actualFlight;
  var userHouse = total.actualHouse;

  // Simulated flight value (used if user didn't actually fly)
  var simulatedFlight = 2.0;
  var userFlight = originalFlight;

  var hasFlown = originalFlight > 0;

  // ===== Step 4: Update labels and default toggle state =====
  jQuery("label[for='flightWith']").text(hasFlown ? "With Flights (Remove if checked)" : "Without Flights");
  jQuery("label[for='flightWithout']").text(hasFlown ? "Without Flights (Add back if unchecked)" : "With Flights (Simulated)");

  if (!hasFlown) {
    jQuery("#flightWith").prop("checked", true);
    userFlight = 0;
  }

  // ===== Step 5: Chart setup =====
  var globalAverage = 5.2;
  var sustainableTarget = 3.0;
  var ctx = document.getElementById("carbonChartComparison").getContext("2d");

  var chartCombined = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Your Emissions", "Global Average", "Sustainable Target"],
      datasets: [
        { label: "Diet", data: [userDiet, 0, 0], backgroundColor: "rgba(217, 155, 253, 0.8)" },
        { label: "Mobility", data: [userMobility, 0, 0], backgroundColor: "rgba(158, 195, 255, 0.8)" },
        { label: "Flight", data: [userFlight, 0, 0], backgroundColor: "rgba(255,205,86,0.8)" },
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

  // ===== Step 6: Show initial total =====
  function updateFootprintTotal(newFlight) {
    const newTotal = userDiet + userMobility + userHouse + newFlight;
    jQuery("#footprint").html(newTotal.toFixed(1) + " t CO<sub>2</sub>/year");
  }

  updateFootprintTotal(userFlight); // display initially

  // ===== Step 7: Toggle listener for flight =====
  jQuery('input[name="flightToggle"]').change(function() {
    const selection = jQuery(this).val();

    const newFlight = (selection === "with")
      ? (hasFlown ? originalFlight : 0)
      : (hasFlown ? 0 : simulatedFlight);

    // Update chart
    chartCombined.data.datasets[2].data[0] = newFlight;

    // Update visible total
    updateFootprintTotal(newFlight);

    chartCombined.update();
    console.log("Flight toggle:", selection, "| New flight:", newFlight);
  });
});
