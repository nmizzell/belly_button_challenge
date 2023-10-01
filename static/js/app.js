const bd = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(bd).then(function(bacteriaData){

  //Initial Dataset
  console.log(bacteriaData)

  // set up basic datasets
  sample_data = bacteriaData.samples
  metadata = bacteriaData.metadata

  function setup_dropdowns(){

    //define dropdown options
    id_list = []

    for (let i=0; i<sample_data.length; i++){
      if (id_list.includes(sample_data[i].id)) {
        //Do nothing
      } else {
        //add the id to the list if it is not already there
        id_list.push(sample_data[i].id)
      }
    }


    //add deopdown options to HTML File
    var test_subject_ids = id_list;     
    var sel = document.getElementById('selDataset');
    for(var i = 0; i < test_subject_ids.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = test_subject_ids[i];
        opt.value = test_subject_ids[i];
        sel.appendChild(opt);
    }
  }

  setup_dropdowns()


  // Main body of code - Data proccessing and plotting
  function main(selected_individual) {
    
    if(selected_individual == undefined){
      selected_individual = 940
    }


    function isSelectedIndividual(individual){
      return individual.id == selected_individual
    }

    //apply the filter to the clean dataset
    sample_data_for_selected_individual = sample_data.filter(isSelectedIndividual)
    metadata_for_selected_individual = metadata.filter(isSelectedIndividual)

    function prepare_data_for_bar_graph(data){

      //sort the data by sample values
      let sorted_sample_data_for_individual = data.sort((a, b) => b.sample_values - a.sample_values)

      //Select only the top 10 values to be graphed
      let topTen = sorted_sample_data_for_individual.slice(0,1)[0]

      //define x and y axis for plotting
      bar_x_axis = topTen.sample_values.slice(0,10) //sample values
      bar_y_axis = topTen.otu_ids.slice(0,10)

      // package y axis labels with OTU to make chart readable
      for (let i=0; i < bar_y_axis.length; i++){
        bar_y_axis[i] = `OTU ${bar_y_axis[i]}`
      }

      //define hovertext field
      bar_hovertext = topTen.otu_labels.slice(0,10)
    }

    function prepare_data_for_bubble_chart(data){

      let index_of_selected_individual = 0


      bubble_x_axis = data[index_of_selected_individual].otu_ids
      bubble_y_axis = data[index_of_selected_individual].sample_values
      bubble_text = data[index_of_selected_individual].otu_labels
      bubble_color = data[index_of_selected_individual].otu_ids
      bubble_size = data[index_of_selected_individual].sample_values
    }

    function prepare_data_for_table(data){
      console.log(data)
      let index_of_selected_individual = 0

      table_info = {
        id: data[index_of_selected_individual].id
        ,ethnicity: data[index_of_selected_individual].ethnicity
        ,gender: data[index_of_selected_individual].gender
        ,age: data[index_of_selected_individual].age
        ,location: data[index_of_selected_individual].location
        ,bbtype: data[index_of_selected_individual].bbtype
        ,wfreq: data[index_of_selected_individual].wfreq
      }
    }

    prepare_data_for_bar_graph(sample_data_for_selected_individual)
    prepare_data_for_bubble_chart(sample_data_for_selected_individual)
    prepare_data_for_table(metadata_for_selected_individual)

    function create_bar_chart() {
      // bar chart
      //set up data trace for graph. reverse all inputs (plotly boilerplate))
      let trace1 = {
        x: bar_x_axis.reverse(),
        y: bar_y_axis.reverse(),
        text: bar_hovertext.reverse(),
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
    }

    function create_bubble_chart(){
      //bubble chart
      let trace2 = {
        x: bubble_x_axis,
        y: bubble_y_axis,
        text: bubble_text,
        mode: 'markers',
        marker: {
          color: bubble_color,
          size: bubble_size
        }
      };

      var data2 = [trace2];

      var layout2 = {
        title: 'Marker Size and Color',
        showlegend: false,
        height: 600,
        width: 600
      };

      Plotly.newPlot('bubble', data2, layout2);
    }

    function create_table(){

      let toString = ({id, ethnicity, gender, age, location, bbtype, wfreq}) => `
      id: ${id}
      ethnicity: ${ethnicity}
      gender: ${gender} 
      age: ${age} 
      location: ${location} 
      bbtype: ${bbtype}
      wfreq: ${wfreq}`

      //print text to table
      document.getElementById('sample-metadata').innerHTML = toString(table_info)
    }

    function create_gauge(){
      console.log(metadata_for_selected_individual[0].wfreq)
      var data3 = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: metadata_for_selected_individual[0].wfreq,
          title: { text: "Wfreq" },
          type: "indicator",
          mode: "gauge+number"
          ,gauge: {
            axis: { range: [null, 9] }}
        }
      ];
      
      var layout3 = { width: 600, height: 500, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data3, layout3);
    }

    create_bar_chart()
    create_bubble_chart()
    create_table()
    create_gauge()

  }



  //listen for change to the dropdown
  d3.selectAll("#selDataset").on("change", updatePlotly);

  function updatePlotly() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let new_selected_individual = dropdownMenu.property("value");

    main(new_selected_individual)
    
    console.log(new_selected_individual)


  }

  main();

})
