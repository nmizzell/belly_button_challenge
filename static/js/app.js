//Initial Dataset
console.log(bacteriaData)

// Select only the sampls portion of the dataset
let cleanData = bacteriaData.samples
console.log(cleanData)

//Placeholder id for selection only one individual in the study
let individualId = '940'

//filter function to get rid of all individuals except the one selected
function isSelectedIndividual(individual){
    return individual.id = individualId
}

//apply the filter to the clean dataset
let filteredData = cleanData.filter(isSelectedIndividual)
console.log(filteredData)

//sort the data by sample values
let sortedBySampleVal = filteredData.sort((a, b) => b.sample_values - a.sample_values)
console.log(sortedBySampleVal)

//Select only the top 10 values to be graphed
let topTen = sortedBySampleVal.slice(0,1)[0]
console.log(topTen)

//define x and y axis for plotting
let x_axis = topTen.sample_values.slice(0,10)
let y_axis = topTen.otu_ids.slice(0,10)

// package y axis labels with OTU to make chart readable
for (let i=0; i < y_axis.length; i++){
    y_axis[i] = `OTU ${y_axis[i]}`
}

//define hovertext field
let hoverText = topTen.otu_labels.slice(0,10)

console.log(x_axis)
console.log(y_axis)
console.log(hoverText)

//set up data trace for graph. reverse all inputs (plotly boilerplate))
let trace1 = {
    x: x_axis.reverse(),
    y: y_axis.reverse(),
    text: hoverText.reverse(),
    // name: "Bacteria",
    type: "bar",
    orientation: "h"
  };
  
  // set up data array
  let data = [trace1];
  
  // formatting and title
  let layout = {
    // title: "Bacteria Data",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };
  
  // plot to screen
  Plotly.newPlot("bar", data, layout);