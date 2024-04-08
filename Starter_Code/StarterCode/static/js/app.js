const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

d3.json(url).then(function(data) {
    console.log(data);

    let ds = data.samples;
    let sv_list = [];
    let oi_list = [];
    let oi_bubble_list = [];
    let ht_list = [];
    let id_list = [];
    let color_list = [];
    let opacity_list = [];
    let size_list = [];

    function RandColors (color_id) {
        let color1 = color_id % 255;
        let color2 = 2 * color_id % 255;
        let color3 = 3 * color_id % 255;
        
        return `rgb(${color1},${color2},${color3})`;
    };

    for (let i = 0; i < ds[i].length ; i++) {
        id_list.push(ds[i].id);
    };
    
    for (let i = 0; i < ds[0].otu_ids.length; i++) {
        oi_list.push("OTU " + ds[0].otu_ids[i].toString());
        oi_bubble_list.push(ds[0].otu_ids[i]);
        sv_list.push(ds[0].sample_values[i]);
        ht_list.push(ds[0].otu_labels[i]);
        color_list.push(RandColors(ds[0].otu_ids[i]));
        opacity_list.push(0.8);
        size_list.push(ds[0].sample_values[i]/1.7);
    };

    let trace1 = {
        x: sv_list.slice(0,10),
        y: oi_list.slice(0,10),
        text: ht_list.slice(0,10),
        type: "bar",
        orientation: "h"
    };
    
    let trace2 = {
        x: oi_bubble_list,
        y: sv_list,
        text: ht_list,
        mode: 'markers',
        marker: {
          color: color_list,
          opacity: opacity_list,
          size: size_list
        }
    };

    d3.selectAll("#selDataset").on("change", changeID);

    function changeID() {

        let dropdownMenu = d3.select("#selDataset");
      
        let dataset = dropdownMenu.property("value");

        let oi_list2 = [];
        let oi_bubble_list2 = [];
        let sv_list2 = [];
        let ht_list2 = [];
        let color_list2 = [];
        let opacity_list2 = [];
        let size_list2 = [];

        for (let i = 0; i < id_list.length ; i++) {
            if (dataset == id_list[i]) {
                for (let j = 0; j < ds[i].otu_ids.length; j++) {
                    oi_list2.push("OTU " + ds[i].otu_ids[j].toString());
                    oi_bubble_list2.push(ds[i].otu_ids[j]);
                    sv_list2.push(ds[i].sample_values[j]);
                    ht_list2.push(ds[i].otu_labels[j]);
                    color_list2.push(RandColors(ds[i].otu_ids[j]));
                    opacity_list2.push(0.8);
                    size_list2.push(ds[i].sample_values[j]/1.7);
                };
                break;
            };
        };

        let newBarTrace = {
            x: sv_list2.slice(0,10),
            y: oi_list2.slice(0,10),
            text: ht_list2.slice(0,10),
            'marker.color': color_list2,
            'marker.opacity': opacity_list2,
            'marker.size': size_list2
        };
    
        let newBubbleTrace = {
            x: oi_bubble_list2,
            y: sv_list2,
            text: ht_list2,
            'marker.color': color_list2,
            'marker.opacity': opacity_list2,
            'marker.size': size_list2
        };  

        updatePlotly(newBarTrace, newBubbleTrace);
    };

    function updatePlotly(newBarTrace, newBubbleTrace) {
        Plotly.restyle("bar", newBarTrace);
        Plotly.restyle("bubble", newBubbleTrace);
    };

    let traceData1 = [trace1];
    let traceData2 = [trace2];
    Plotly.newPlot("bar", traceData1);
    Plotly.newPlot('bubble', traceData2);

    changeID();

});