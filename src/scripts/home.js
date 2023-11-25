// Icon links
var carIconSrc = "../images/car.png";
var phoneIconSrc = "../images/charging.png";
var gasIconSrc = "../images/gas-station.png";
var treeIconSrc = "../images/plant.png";
var carbonIconSrc = "../images/carbon-capture.png";
var compostIconSrc = "../images/compostable.png";

window.onload = function () {
  document
    .getElementById("submit")
    .addEventListener("click", handleFormSubmission);

  // Live form validation.
  const inputField = document.getElementById("input-text");

  inputField.addEventListener("input", function (event) {
    const inputValue = event.target.value;
    const isValidInput = /^\d*\.?\d*$/.test(inputValue); // Regular expression to check for rational numbers

    if (!isValidInput) {
      inputField.value = inputField.value.substring(
        0,
        inputField.value.length - 1,
      ); // Clear the last inputted char if it was invalid.
    }
  });
};

function handleFormSubmission() {
  var content = document.getElementById("user-input-content");
  content.innerHTML = ""; // Clear the content div

  if (
    document.getElementById("input-text").value.trim() == "" ||
    document.getElementById("measurement").value == "" ||
    document.getElementById("compost-type").value == ""
  ) {
    formValidation();
  } else {
    if (document.getElementById("form-validation-alert") != null) {
      document.getElementById("form-validation-alert").remove();
    }
    var input = document.getElementById("input-text");
    var unit = document.getElementById("measurement");
    var type = document.getElementById("compost-type");

    // Store the input values in local storage
    localStorage.setItem("input", input.value);
    localStorage.setItem("unit", unit.value);
    localStorage.setItem("type", type.value);

    let kgCo2 = convertToKgCO2(input.value, unit.value).toFixed(2);
    let kgDesc = "kg of CO2 saved";

    let tonsOfCo2 = kgCo2 / 1000;

    let milesDriven = convertToMilesDriven(tonsOfCo2).toFixed(2);
    let mdDesc = "miles driven";

    let smartPhonesCharged = convertToSmartPhonesCharged(tonsOfCo2).toFixed(2);
    let spDesc = "phones charged";

    let gallonsOfGas = convertToGasConsumed(tonsOfCo2).toFixed(2);
    let gogDesc = "gallons of gas consumed";

    let treeSeedlingsGrown = convertToTreeSeedlingsGrown(tonsOfCo2).toFixed(2);
    let tsgDesc = "tree seedlings grown for 10 years";

    let acresOfForest = convertToAcresOfForest(tonsOfCo2).toFixed(2);
    let aofDesc = "acres of forest in one year";

    // Get the percentile of the user's composting
    let lbsComposted = kgCo2 / 0.1814;
    let galsComposted = lbsComposted / 6.18891540495;
    let map = {
      food: JSON.parse(localStorage.getItem("allFoodWasteComposted")),
      yard: JSON.parse(localStorage.getItem("allYardWasteComposted")),
      all: JSON.parse(localStorage.getItem("allWasteComposted")),
    };
    let description =
      "According to our data, you were in the top " +
      percentile(map[type.value], galsComposted).toFixed(2) +
      "% of composters in Santa Clara.";
    // console.log("Gals composted: " + galsComposted);
    // console.log("Map type: " + map[type.value]);
    // console.log(percentile(map[type.value], galsComposted) + "%");
    // console.log(percentile2(map[type.value], galsComposted) + "%");
    // console.log(percentile3(map[type.value], galsComposted) + "%");
    content.appendChild(createInfoContainerElement(description, "4/5", "1/2"));

    content.appendChild(
      createStatsContainerElement(
        kgCo2,
        kgDesc,
        carbonIconSrc,
        "25px",
        "4/5",
        "1/2",
      ),
    );

    content.appendChild(
      createTwoStatsRowContainer(
        milesDriven,
        smartPhonesCharged,
        mdDesc,
        spDesc,
        carIconSrc,
        phoneIconSrc,
        "30px",
        "18px",
        "4/5",
        "1/2",
      ),
    );

    content.appendChild(
      createTwoStatsRowContainer(
        gallonsOfGas,
        treeSeedlingsGrown,
        gogDesc,
        tsgDesc,
        gasIconSrc,
        treeIconSrc,
        "18px",
        "17px",
        "4/5",
        "1/2",
      ),
    );
  }
}

function createInfoContainerElement(
  description,
  mobileWidth = "4/5",
  desktopWidth = "3/12",
) {
  var display = document.createElement("div");
  display.innerHTML = description;
  display.classList.add(
    "bg-green-100",
    "border-l-4",
    "border-green-500",
    "text-green-700",
    "rounded",
    "p-4",
    "mt-4",
    `md:w-${desktopWidth}`,
    `w-${mobileWidth}`,
    "mx-auto",
  );

  var info = document.createElement("p");
  info.classList.add("font-bold", "text-center");
  display.appendChild(info);

  return display;
}

function createStatsContainerElement(
  statistic,
  description,
  iconSrc,
  iconSize = "30px",
  width = "4/5",
  desktopWidth = "3/12",
) {
  // Rewrite statistic with a K if over 1000
  if (statistic > 1000) {
    statistic = (statistic / 1000).toFixed(2) + "K";
  }

  var container = document.createElement("div");
  container.classList.add(
    "p-8",
    "bg-gray-100",
    "border",
    "border-gray-300",
    "rounded-3xl",
    `w-${width}`,
    `md:w-${desktopWidth}`,
    "mx-auto",
    "mt-2",
  );

  var stat = document.createElement("p");
  stat.classList.add(
    "font-heading",
    "mb-6",
    "text-3xl",
    "md:text-6xl",
    "text-anr-blue",
    "font-black",
    "tracking-tight",
    "max-w-full",
  );
  stat.innerHTML = statistic;

  var desc = document.createElement("span");
  desc.classList.add(
    "font-heading",
    "mb-2",
    "text-base",
    "text-gray-700",
    "font-bold",
  );

  var icon = document.createElement("img");
  icon.classList.add("inline");
  icon.src = iconSrc;
  icon.style.height = iconSize;
  icon.alt = "icon";

  desc.appendChild(icon);
  desc.innerHTML += " " + description;

  container.appendChild(stat);
  container.appendChild(desc);

  return container;
}

function createTwoStatsRowContainer(
  stat1,
  stat2,
  desc1,
  desc2,
  icon1,
  icon2,
  icon1Sz = "30px",
  icon2Sz = "30px",
  mobileWidth = "4/5",
  desktopWidth = "3/12",
) {
  var container = document.createElement("div");
  container.classList.add(
    "flex",
    `w-${mobileWidth}`,
    `md:w-${desktopWidth}`,
    "mx-auto",
  );

  var statCont1 = createStatsContainerElement(stat1, desc1, icon1, icon1Sz);
  statCont1.classList.remove("md:w-3/12");
  statCont1.classList.add("mr-1", "md:w-1/2");
  var statCont2 = createStatsContainerElement(stat2, desc2, icon2, icon2Sz);
  statCont2.classList.remove("md:w-3/12");
  statCont2.classList.add("ml-1", "md:w-1/2");

  container.appendChild(statCont1);
  container.appendChild(statCont2);

  return container;
}

function convertToKgCO2(input, unit) {
  if (unit == "kilograms") {
    // Convert from kg to lbs.
    input *= 2.20462;
  }
  if (unit == "gallons") {
    // Convert from gallons to lbs.
    input *= 6.18891540495;
  }
  if (unit == "liters") {
    // Convert from liters to lbs.
    input *= 1.63493925492;
  }

  // Convert from lbs to kg CO2 saved.
  const KgCO2SavedPerPound = 0.1814;
  return input * KgCO2SavedPerPound;
}

function convertToMilesDriven(MetricTonsOfCo2) {
  return MetricTonsOfCo2 / 0.00039;
}

function convertToSmartPhonesCharged(MetricTonsOfCo2) {
  return MetricTonsOfCo2 / 0.00000822;
}

function convertToGasConsumed(MetricTonsOfCo2) {
  return MetricTonsOfCo2 / 0.008887;
}

function convertToTreeSeedlingsGrown(MetricTonsOfCo2) {
  return MetricTonsOfCo2 / 0.06;
}

function convertToAcresOfForest(MetricTonsOfCo2) {
  return MetricTonsOfCo2 / 0.84;
}

function formValidation() {
  var alert =
    document.getElementById("form-validation-alert") != null
      ? document.getElementById("form-validation-alert")
      : document.createElement("div");
  alert.id = "form-validation-alert";
  var error = "";
  // handle different combinations of empty fields
  let prevError = false;
  let errMsgDetails = "";
  if (document.getElementById("input-text").value.trim() == "") {
    prevError = true;
    errMsgDetails += "quantity";
  }
  if (document.getElementById("measurement").value == "") {
    errMsgDetails += prevError ? "/unit" : "unit";
    prevError = true;
  }
  if (document.getElementById("compost-type").value == "") {
    errMsgDetails += prevError ? "/type" : "type";
    prevError = true;
  }
  error = "Please enter a valid " + errMsgDetails + " for composting.";
  alert.innerHTML =
    `<div class="w-4/5 md:w-[40%] mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong class="font-bold">Uh-oh! That's not how much you composted!</strong>
    <span class="block sm:inline">` +
    error +
    `</span>
  </div>`;
  document.getElementById("form").appendChild(alert);
}

// Load data and create charts using Google Sheets API

const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];

function handleClientLoad() {
  gapi.load("client", initClient);
}

function initClient() {
  try {
    gapi.client
      .init({
        apiKey: "AIzaSyAalwjvT0D5TWInJchaijnw6L7iap6nCJ0",
        discoveryDocs: DISCOVERY_DOCS,
      })
      .then(function () {
        loadSheets();
      });
  } catch (e) {
    console.log(e);
  }
}

function loadSheets() {
  const spreadsheetId = "1a2lu7WKtuDUc8pVww3tYwzoSUcgwdtpoWC1CxdEGaoI";
  const sheetName = "Sheet1";

  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId,
      range: sheetName,
    })
    .then(
      function (response) {
        const values = response.result.values;
        totalFoodCompost = values[1][2];
        totalYardCompost = values[1][3];
        foodWasteMonth1 = values[3][5];
        foodWasteMonth2 = values[3][6];
        foodWasteMonth3 = values[3][7];
        foodWasteMonth4 = values[3][8];
        foodWasteDataByMonth = [
          foodWasteMonth1,
          foodWasteMonth2,
          foodWasteMonth3,
          foodWasteMonth4,
        ];
        yardWasteMonth1 = values[4][5];
        yardWasteMonth2 = values[4][6];
        yardWasteMonth3 = values[4][7];
        yardWasteMonth4 = values[4][8];
        yardWasteDataByMonth = [
          yardWasteMonth1,
          yardWasteMonth2,
          yardWasteMonth3,
          yardWasteMonth4,
        ];

        let averageTotalCompostPerUser = 0;
        let totalUsers = 0;
        for (var i = 1; i < values.length; i++) {
          if (values[i][0].trim() == "" || values[i][1].trim() == "") continue;
          //console.log(values[i][0] + " " + values[i][1]);
          totalUsers++;
          averageTotalCompostPerUser += parseFloat(values[i][0]);
          averageTotalCompostPerUser += parseFloat(values[i][1]);
        }
        let totalCO2Saved = convertToKgCO2(
          averageTotalCompostPerUser,
          "gallons",
        );
        console.log(totalUsers);
        averageTotalCompostPerUser = (
          averageTotalCompostPerUser / totalUsers
        ).toFixed(2);
        createCharts(
          totalFoodCompost,
          totalYardCompost,
          foodWasteDataByMonth,
          yardWasteDataByMonth,
          totalCO2Saved,
          averageTotalCompostPerUser,
        );

        allFoodWasteComposted = values
          .slice(1)
          .map((row) => parseFloat(row[0]));

        allYardWasteComposted = values
          .slice(1)
          .map((row) => parseFloat(row[1]));

        // For the total, total[i] = allFoodWasteComposted[i] + allYardWasteComposted[i]
        allWasteComposted = allFoodWasteComposted.map(
          (value, index) => value + allYardWasteComposted[index],
        );

        localStorage.setItem(
          "allWasteComposted",
          JSON.stringify(allWasteComposted),
        );
        localStorage.setItem(
          "allFoodWasteComposted",
          JSON.stringify(allFoodWasteComposted),
        );
        localStorage.setItem(
          "allYardWasteComposted",
          JSON.stringify(allYardWasteComposted),
        );
      },
      function (response) {
        console.error(
          "Error loading sheet data:",
          response.result.error.message,
        );
      },
    );
}

function percentile(arr, value) {
  //remove empty values from array
  arr = arr.filter((x) => x !== null && x !== "");
  const currentIndex = 0;
  const totalCount = arr.reduce((count, currentValue) => {
    if (currentValue < value) {
      return count + 1; // add 1 to `count`
    } else if (currentValue === value) {
      return count + 0.5; // add 0.5 to `count`
    }
    return count + 0;
  }, currentIndex);
  return (totalCount * 100) / arr.length;
}

function createCharts(
  totalFoodCompost,
  totalYardCompost,
  foodWasteDataByMonth,
  yardWasteDataByMonth,
  totalCO2Saved,
  averageCompostPerUser,
) {
  // Reformat data.
  if (totalCO2Saved > 1000) {
    totalCO2Saved = (totalCO2Saved / 1000).toFixed(2) + "K";
  } else totalCO2Saved = totalCO2Saved.toFixed(2);
  document.getElementById("pie-chart").ariaLabel =
    "Pie chart showing the amount of food waste composted compared to yard waste composted in gallons, where the total food waste composted was " +
    totalFoodCompost +
    " gallons and the total yard waste composted was " +
    totalYardCompost +
    " gallons.";

  document.getElementById("bar-chart").ariaLabel =
    "Stacked bar chart showing food waste composted versus yard waste composted by month, where the total food waste for Month 1 was " +
    foodWasteDataByMonth[0] +
    " gallons, while for month 2 it was " +
    foodWasteDataByMonth[1] +
    " gallons, for month 3 it was " +
    foodWasteDataByMonth[2] +
    " gallons, and for month 4 it was " +
    foodWasteDataByMonth[3] +
    " gallons. The total yard waste for Month 1 was " +
    yardWasteDataByMonth[0] +
    " gallons, while for month 2 it was " +
    yardWasteDataByMonth[1] +
    " gallons, for month 3 it was " +
    yardWasteDataByMonth[2] +
    " gallons, and for month 4 it was " +
    yardWasteDataByMonth[3] +
    " gallons.";

  const pieChartElement = document.getElementById("pie-chart").getContext("2d");
  new Chart(pieChartElement, {
    type: "pie",
    data: {
      labels: ["Food Waste (gallons)", "Yard Waste (gallons)"],
      datasets: [
        {
          labels: [],
          data: [totalFoodCompost, totalYardCompost],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Food Waste vs Yard Waste",
        },
      },
      responsive: true,
      aspectRatio: 1,
      maintainAspectRatio: true,
    },
  });

  // Max should be the max value of the two arrays summed together,
  // rounded to the nearest 50.
  let max =
    Math.max(...foodWasteDataByMonth) + Math.max(...yardWasteDataByMonth);
  let maxYAxis = Math.ceil(max / 50) * 50;

  const stackedBarChartElement = document
    .getElementById("bar-chart")
    .getContext("2d");
  new Chart(stackedBarChartElement, {
    type: "bar",
    data: {
      labels: ["June 2023", "July 2023", "August 2023", "September 2023"],
      datasets: [
        {
          label: "Food Waste (gallons)",
          data: foodWasteDataByMonth,
          borderWidth: 1,
        },
        {
          label: "Yard Waste (gallons)",
          data: yardWasteDataByMonth,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Food Waste vs Yard Waste by Month",
        },
      },
      responsive: true,
      aspectRatio: window.innerWidth <= 900 ? 1 : 1.9, // Adjust the aspect ratio for mobile/desktop
      maintainAspectRatio: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: maxYAxis,
        },
      },
    },
  });
  const rightChartContainer = document.getElementById("statistics-container");
  let bigStatsContainer = document.createElement("div");

  bigStatsContainer.innerHTML = `<div class="mt-10 pb-3">
      <div class="relative">
        <div class="absolute inset-0 h-1/2"></div>
        <div class="md:max-w-[75%] tablet:max-w-xl relative mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto md:max-w-[75%] tablet:max-w-xl">
            <dl class="rounded-lg border-[1px] border-gray-100 bg-white shadow-lg sm:grid sm:grid-cols-2">
              <div
                class="flex flex-col border-b border-gray-200 p-6 text-center sm:border-0 sm:border-r"
              >
                <dt
                  class="order-2 mt-2 text-lg font-medium leading-6 text-gray-500"
                  id="item-1"
                >
                  total kg CO2 saved
                </dt>
                <dd
                  class="order-1 text-5xl font-extrabold leading-none text-anr-off-blue"
                  aria-describedby="item-1"
                >
                  ${totalCO2Saved}
                </dd>
              </div>
              <div
                class="flex flex-col border-b border-t border-gray-200 p-6 text-center sm:border-0 sm:border-l sm:border-r"
              >
                <dt
                  class="order-2 mt-2 text-lg font-medium leading-6 text-gray-500"
                >
                average gallons compost per survey respondent 
                </dt>
                <dd
                  class="order-1 text-5xl font-extrabold leading-none text-anr-off-blue"
                >
                ${averageCompostPerUser}
                </dd>
              </div>
              
            </dl>
          </div>
        </div>
      </div>
    </div>
    `;
  rightChartContainer.after(bigStatsContainer);
}
