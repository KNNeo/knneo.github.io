var TimeKnots = {
  draw: function(id, events, options){
    var cfg = {
      width: document.getElementById(id.toString().substring(1)).getBoundingClientRect().width,
      height: document.getElementById(id.toString().substring(1)).getBoundingClientRect().height,
      radius: 10,
      lineWidth: 4,
      color: "#999",
      background: "#FFF",
      dateFormat: "%Y/%m/%d %H:%M:%S",
      horizontalLayout: true,
      showLabels: false,
      labelFormat: "%Y/%m/%d %H:%M:%S",
      addNow: false,
      seriesColor: d3.scale.category20(),
      dateDimension: true
    };


    //default configuration overrid
    for(var i in cfg){
      if(options[i] != undefined){
        cfg[i] = options[i];
      }
    }
    if(cfg.addNow != false){
      events.push({date: new Date(), name: cfg.addNowLabel || "Today"});
    }
    var tip = d3.select(id)
    .append('div')
    .style("opacity", 0)
    .style("position", "fixed")
    .style("font-family", "Open Sans")
    .style("font-weight", "300")
    .style("background","rgba(0,0,0,0.5)")
    .style("color", "white")
    .style("padding", "2px 5px")
    .style("margin", "2px 5px")
    .style("-moz-border-radius", "8px 8px")
    .style("border-radius", "8px 8px");
    var svg = d3.select(id).append('svg').attr("width", cfg.width-20).attr("height", cfg.height);
    //Calculate times in terms of timestamps
    if(!cfg.dateDimension){
      var timestamps = events.map(function(d){return  d.value});//new Date(d.date).getTime()});
      var maxValue = d3.max(timestamps);
      var minValue = d3.min(timestamps);
    }else{
      var timestamps = events.map(function(d){return  Date.parse(d.date);});//new Date(d.date).getTime()});
      var maxValue = d3.max(timestamps);
      var minValue = d3.min(timestamps);
    }
    var margin = (d3.max(events.map(function(d){return d.radius})) || cfg.radius)*1.5+cfg.lineWidth;
    var step = (cfg.horizontalLayout)?((cfg.width-20-2*margin)/(maxValue - minValue)):((cfg.height-2*margin)/(maxValue - minValue));
    var series = [];
    if(maxValue == minValue){step = 0;if(cfg.horizontalLayout){margin=cfg.width-20/2}else{margin=cfg.height/2}}

    linePrevious = {
      x1 : null,
      x2 : null,
      y1 : null,
      y2 : null
    }

    svg.selectAll("line")
    .data(events).enter().append("line")
    .attr("class", "timeline-line")
      .attr("x1", function(d){
                      var ret;
                      if(cfg.horizontalLayout){
                        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                        ret = Math.floor(step*(datum - minValue) + margin)
                      }
                      else{
                        ret = Math.floor(cfg.width-20/2)
                      }
                      linePrevious.x1 = ret
                      return ret
                      })
    .attr("x2", function(d){
                      if (linePrevious.x1 != null){
                          return linePrevious.x1
                      }
                      if(cfg.horizontalLayout){
                        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                        ret = Math.floor(step*(datum - minValue ))
                      }
                      return Math.floor(cfg.width-20/2)
                      })
    .attr("y1", function(d){
                      var ret;
                      if(cfg.horizontalLayout){
                        ret = Math.floor(cfg.height/2)
                      }
                      else{
                        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                        ret = Math.floor(step*(datum - minValue)) + margin
                      }
                      linePrevious.y1 = ret
                      return ret
                      })
    .attr("y2", function(d){
                      if (linePrevious.y1 != null){
                        return linePrevious.y1
                      }
                      if(cfg.horizontalLayout){
                        return Math.floor(cfg.height/2)
                      }
                      var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                      return Math.floor(step*(datum - minValue))
                      })
    .style("stroke", function(d){
                      if(d.color != undefined){
                        return d.color
                      }
                      if(d.series != undefined){
                        if(series.indexOf(d.series) < 0){
                          series.push(d.series);
                        }
                        return cfg.seriesColor(series.indexOf(d.series));
                      }
                      return cfg.color})
    .style("stroke-width", cfg.lineWidth);
	
    svg.selectAll("circle")
    .data(events).enter()
    .append("circle")
    .attr("class", "timeline-event")
    .attr("r", function(d){if(d.radius != undefined){return d.radius} return cfg.radius})
    .style("stroke", function(d){
                    if(d.color != undefined){
                      return d.color
                    }
                    if(d.series != undefined){
                      if(series.indexOf(d.series) < 0){
                        series.push(d.series);
                      }
                      console.log(d.series, series, series.indexOf(d.series));
                      return cfg.seriesColor(series.indexOf(d.series));
                    }
                    return cfg.color}
    )
    .style("stroke-width", function(d){if(d.lineWidth != undefined){return d.lineWidth} return cfg.lineWidth})
    .style("fill", function(d){ if(d.name == "Me") { return "#00e4ff" } if(d.background != undefined){ return d.background } return cfg.background})
    .attr("cy", function(d){
        if(cfg.horizontalLayout){
          return Math.floor(cfg.height/2)
        }
        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
        return Math.floor(step*(datum - minValue) + margin)
    })
    .attr("cx", function(d){
        if(cfg.horizontalLayout){
          var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
          var x=  Math.floor(step*(datum - minValue) + margin);
          return x;
        }
        return Math.floor(cfg.width-20/2)
    })
	.on("mouseover", function(d){
	  d3.selectAll("circle")
      .style("fill", function(d){ if(d.name == "Me") { return "#00e4ff" } if(d.background != undefined){ return d.background } return cfg.background});
      if(cfg.dateDimension){
        var format = d3.time.format(cfg.dateFormat);
        var datetime = format(new Date(d.date));
        var dateValue = (datetime != "")?("<a href=\"#" +d.name.replace(" ","")+ "\">" +d.name+" ("+datetime+")</small></a>"):d.name;
      }else{
        var format = function(d){return d}; // TODO
        var datetime = d.value;
        var dateValue = "<a href=\"#" +d.name.replace(" ","")+ "\">" + d.name +"<small> ("+d.value+")</small></a>";
      }
      d3.select(this)
      .style("fill", function(d){if(d.color != undefined){return d.color} return cfg.color}).transition()
	  .duration(100);//.attr("r",  function(d){if(d.radius != undefined){return Math.floor(d.radius*1.5)} return Math.floor(cfg.radius*1.5)});
      tip.html("");
      if(d.img != undefined){
        tip.append("img").style("float", "left").style("margin-right", "4px").attr("src", d.img).attr("width", "64px");
      }
      tip.append("div").style("float", "left").html(dateValue);
      tip.transition()
      .duration(100)
      .style("opacity", 1);
    })
    .on("mouseout", function(){
        d3.select(this)
        // .style("fill", function(d){if(d.background != undefined){return d.background} return cfg.background})
			.transition()
        .duration(100).attr("r", function(d){if(d.radius != undefined){return d.radius} return cfg.radius});
        tip.transition()
        .duration(100)
    .style("opacity", 1)})
	.on("click", function(d){
      if(cfg.dateDimension){
        var format = d3.time.format(cfg.dateFormat);
        var datetime = format(new Date(d.date));
        var dateValue = (datetime != "")?(d.name+" ("+datetime+")</small>"):d.name;
      }else{
        var format = function(d){return d}; // TODO
        var datetime = d.value;
        var dateValue = d.name +"<small> ("+d.value+")</small>";
      }
      d3.select(this)
      .style("fill", function(d){if(d.color != undefined){return d.color} return cfg.color}).transition()
	  .duration(100);//.attr("r",  function(d){if(d.radius != undefined){return Math.floor(d.radius*1.5)} return Math.floor(cfg.radius*1.5)});
      tip.html("");
      if(d.img != undefined){
        tip.append("img").style("float", "left").style("margin-right", "4px").attr("src", d.img).attr("width", "64px");
      }
      tip.append("div").style("float", "left").html(dateValue);
      tip.transition()
      .duration(100)
      .style("opacity", 1);
    });
	
	//tooltip to stay on cursor when mouse on circle
    svg.on("mousemove", function(){
        tipPixels = parseInt(tip.style("height").replace("px", ""));
    return tip.style("left", (document.getElementById(id.toString().substring(1)).getBoundingClientRect().x)+"px").style("top", (document.getElementById(id.toString().substring(1)).getBoundingClientRect().y)+"px");})//.style("top", (d3.event.pageY-tipPixels-margin)+"px").style("left",(d3.event.pageX+20)+"px");}) //top and left are aligned wrongly
    // .on("mouseout", function(){return tip.style("opacity", 0).style("top","0px").style("left","0px");})
	;

    //Adding start and end labels
    if(cfg.showLabels != false){
      if(cfg.dateDimension){
        var format = d3.time.format(cfg.labelFormat);
        var startString = format(new Date(minValue));
        var endString = format(new Date(maxValue));
      }else{
        var format = function(d){return d};
        var startString = minValue;
        var endString = maxValue;
      }
	  var labelMargin = 25;
      svg.append("text")
         .text(startString).style("font-size", "70%").style("fill", "white").style("font-family", "Open Sans")
		 .attr("x", labelMargin/4)
		 .attr("y", cfg.height/2 + labelMargin);
         //.attr("x", function(d){if(cfg.horizontalLayout){return d3.max([0, (margin-this.getBBox().width/2)])} return Math.floor(this.getBBox().width/2)})
         //.attr("y", function(d){if(cfg.horizontalLayout){return Math.floor(cfg.height/2+(margin+this.getBBox().height))}return margin+this.getBBox().height/2+10});

      svg.append("text")
         .text(endString).style("font-size", "70%").style("fill", "white").style("font-family", "Open Sans")
		 .attr("x", cfg.width - labelMargin*2)
		 .attr("y", cfg.height/2 + labelMargin)
         //.attr("x", function(d){if(cfg.horizontalLayout){return  cfg.width-20 -  d3.max([this.getBBox().width, (margin+this.getBBox().width/2)])} return Math.floor(this.getBBox().width/2)})
         //.attr("y", function(d){if(cfg.horizontalLayout){return Math.floor(cfg.height/2+(margin+this.getBBox().height))}return cfg.height-margin+this.getBBox().height/2+10})
    }
  }
}
