
// Global variable to use to get data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


//Creating the bar graph
function barGraph(sampleID)
{
    console.log(`show barGraph(${sampleID})`);

    d3.json(url).then(data => {
        //collecting data from json
        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleID);
        let result = resultArray[0];
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        //Create the yticks for the graph by using map() to grab the otu_ids in the array
        let yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
        //create a trace object
        let barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: 'bar',
            text: otu_labels.slice(0, 10).reverse(),
            orientation: `h`
        };
        //Put the trace object into an array
        let barArray = [barData];

        //create a bar layout object
        let barLayout = {
            title: `Top Bacteria Found`,
        };
        
        //Plot the graph
        Plotly.newPlot("bar", barArray, barLayout)
    });
}

//Creating the bubble graph
function bubbleGraph(sampleID)
{
    console.log(`show bubbleGraph(${sampleID})`);

    d3.json(url).then(data => {    
    //collecting  data from json
        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleID);
        let result = resultArray[0];
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        //Create a trace object
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };

        //Put the trace object into an array
        let bubbleArray = [bubbleData];

        //create a bar layout object
        let bubbleLayout = {
            title: `Bacteria per Samples`,
            margin: {t: 30},
            hovermode: `closest`,
            xaxis: {title: `OTU ID`}
        };

         //Plot the graph
         Plotly.newPlot("bubble", bubbleArray, bubbleLayout)
    });
}
// Creating Gauge chart

function gaugeGraph(sampleId)
{
    console.log(`show gaugeGraph(${sampleId})`);

    d3.json(url).then(data => {

        let metadata = data.metadata;

        console.log(metadata);
        let resultArray = metadata.filter(s => s.id == sampleId);
        let result = resultArray[0];
        let wfreq = result.wfreq;

  
        var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: "<b>Wash Frequency</b><br><i>Scrubs per week</i>"},
          type: "indicator",
          mode: "gauge+number+range",
          gauge: {
            axis: { range: [0, 10] },
            bar: {color: "red"},
            steps: [
              { range: [0, 1], color: "rgb(200,215,200)" },
              { range: [1, 2], color: "rgb(210,215,165)" },
              { range: [2, 3], color: "rgb(200,215,130)" },
              { range: [3, 4], color: "rgb(190,215,110)" },
              { range: [4, 5], color: "rgb(160,215,90)" },
              { range: [5, 6], color: "rgb(160,210,40)" },
              { range: [6, 7], color: "rgb(55, 215,100)" },
              { range: [7, 8], color: "rgb(40,204,75)" },
              { range: [8, 9], color: "rgb(60,153,60)" },
              { range: [9, 10], color: "rgb(42,146,60)" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 10
            }
            }
        }
        ]

        // Create layout
        var gaugelayout = { width: 600, height: 500, margin: { t: 30, b: 50 } };
        

        // Call Plotly
        Plotly.newPlot('gauge', data, gaugelayout);
    });
}

// Create metadata/demographic table 
function metaData(sampleID)
{
    console.log('show metaData(${sampleID})');

    //let selector = d3.select("sample-metadata")

    d3.json(url).then(data => {
        let metadata = data.metadata;

        let resultsArray = metadata.filter(m => m.id == sampleID);
        let result = resultsArray[0];
        console.log(result);


        let id = result.id;
        let ethnicity = result.ethnicity;
        let gender = result.gender;
        let age = result.age;
        let location = result.location;
        let bbtype = result.bbtype;
        let wfreq = result.wfreq;

        metaDemoInfo = `ID: ${id} <br> Ethnicity: ${ethnicity} <br> Gender: ${gender} <br> Age: ${age} <br> Location: ${location} <br> BBType: ${bbtype} <br> WFreq: ${wfreq}`
        document.getElementById('sample-metadata').innerHTML = metaDemoInfo;
    });
}

function optionChanged(sampleID)
{
    console.log(`optionChaged: ${sampleID}`);
    barGraph(sampleID);
    bubbleGraph(sampleID);
    gaugeGraph(sampleID);
    metaData(sampleID);
    

}

function fillDropdown()
{
    //Initializing the dropdown
    let selector = d3.select("#selDataset");

    //Get a handle to the dropdown
    d3.json(url).then(data => {
        console.log(`Here's the data:`, data);

        //Create a variable to help with for loop and populating the dropdown table
        let sampleNames = data.names;
        //console.log(`The sample names:`, sampleNames);

        //For loop to populate dropdown table with subject ids
        for (let i = 0; i < sampleNames.length; i++) {
            let sampleID = sampleNames[i];
            //console.log(`Sample ID = ${sampleID}`);
            selector.append("option").text(sampleID);
        };
    //Read the current dropdown value
    let initialID = selector.property("value");
    console.log(`initialId = ${initialID}`);


    //Draw a bargraph of the selected value
    barGraph(initialID);
    //Draw a bubble graph of the selected value
    bubbleGraph(initialID);
    //Show Gauge graph of sample ID
    gaugeGraph(initialID);
    //Show meta/demographic data
    metaData(initialID);
    });

}

fillDropdown();