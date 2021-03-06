import React, { Component } from "react";
import * as d3 from 'd3';
import dagreD3 from "dagre-d3";
import $ from 'jquery';
import * as tipsy from 'tipsy'

import {
  getWorkflowSimpleDescription,
} from "@/services/workflows";
import {message, Spin} from "antd";


class WorkflowGraph extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      workflowSimpleDescription: {},
      graphLoading: false,
    }
  }

  componentDidMount() {
    this.fetchWorkflowSimpleDescription(this.props.workflowId);
  }

  fetchWorkflowSimpleDescription = async(workflowId: number)=> {
    this.setState({graphLoading: true});
    const result = await getWorkflowSimpleDescription(workflowId);
    if (result.code !== 0 ){
      message.error(result.msg)
    }
    else {
      this.setState({workflowSimpleDescription: result.data, graphLoading: false}, ()=>this.drawWorkflowGraph())
    }
  }

  drawWorkflowGraph =() =>{
    let g = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(function() { return {}; });

    let states = new Array();
    this.state.workflowSimpleDescription.workflow_state_info.forEach(function(state0: any) {
      states[state0.id] = {label: state0.name, otherAttr: state0};
      if (state0.type_id == 1) {
        g.setNode(state0.id, {
          label: state0.name,
          class: "type-start",
          description: state0.participant,
          otherAttr: state0
        });
      } else if (state0.type_id == 2) {
        g.setNode(state0.id, {
          label: state0.name,
          class: "type-end",
          description: state0.participant,
          otherAttr: state0
        });
      } else {
        g.setNode(state0.id, {label: state0.name, description: state0.participant, otherAttr: state0});
      }
    })

    g.nodes().forEach(function(v) {
      var node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 5;
    });

    this.state.workflowSimpleDescription.workflow_transition_info.forEach(function(transition0:any){
      if (transition0.condition_expression !== '[]'){
        //??????????????????????????????????????????????????????id+100000??????setnode???id?????????????????????id??????
        g.setNode(transition0.source_state_id+100000, {label: "???????????????", style: "fill: #afa", shape: "diamond", otherAttr:{type_id: 0}});
        g.setEdge(transition0.source_state_id, transition0.source_state_id+100000, {
          label: transition0.name,
          curve: d3.curveBasis
        });
        JSON.parse(transition0.condition_expression).forEach(function(condition_expression0){
          g.setEdge(transition0.source_state_id+100000, condition_expression0.target_state_id, {
            label: condition_expression0.expression,
            curve: d3.curveBasis
          });
        })
      }else {
        g.setEdge(transition0.source_state_id, transition0.destination_state_id, {
          label: transition0.name,
          curve: d3.curveBasis
        });
      }
    })

    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg"),
      inner = svg.append("g");

    // Set up zoom support
    var zoom = d3.zoom()
      .on("zoom", function() {
        inner.attr("transform", d3.event.transform);
      });
    svg.call(zoom);

    // Simple function to style the tooltip for the given node.
    var styleTooltip = function(name, description) {
      return "<p>" + name + "</p><p class='description'>" + description + "</p>";
      // return "<p class='name'>" + name + "</p><p class='description'>" + description + "</p>";
    };

    // Run the renderer. This is what draws the final graph.
    render(inner, g);

    inner.selectAll("g.node")
      .attr("title", function(v) {
        var otherAttr=g.node(v).otherAttr;
        // var description=otherAtrr.participant;
        // var description = "?????????:" + otherAtrr.participant + "<br>" + "???????????????:" + otherAtrr.participant_type_id ;
        // var description = JSON.stringify(otherAttr, null, 4);

        var description = "";
        var stateTypeDesc = "";
        var isHiddenDesc = "???";
        var participantTypeDesc = "";


        if (otherAttr.type_id === 0){
          stateTypeDesc = '????????????';
        }else if (otherAttr.type_id === 1){
          stateTypeDesc = "????????????";
        } else if (otherAttr.type_id === 1){
          stateTypeDesc = "????????????";
        };
        if (otherAttr.is_hidden){
          isHiddenDesc = "???";
        };
        if(otherAttr.participant_type_id===1){
          participantTypeDesc = "??????";
        }else if (otherAttr.participant_type_id===2){
          participantTypeDesc = "??????";
        }else if (otherAttr.participant_type_id===3){
          participantTypeDesc = "??????";
        }else if (otherAttr.participant_type_id===4){
          participantTypeDesc = "??????";
        }else if (otherAttr.participant_type_id===5){
          participantTypeDesc = "??????";
        }else if (otherAttr.participant_type_id===6){
          participantTypeDesc = "??????";
        }else if (otherAttr.participant_type_id===7){
          participantTypeDesc = "????????????";
        }else if (otherAttr.participant_type_id===8){
          participantTypeDesc = "???????????????";
        }else if (otherAttr.participant_type_id===9){
          participantTypeDesc = "??????";
        };
        description += "??????ID: "+ otherAttr.order_id + "</br>";
        if (otherAttr.sub_workflow_id){
          description += "????????????ID:" + otherAttr.sub_workflow_id
        };
        description += "????????????: "+ stateTypeDesc + "</br>";
        description += "????????????: "+ isHiddenDesc + "</br>";
        description += "???????????????: "+ participantTypeDesc + "</br>";
        description += "?????????: "+ otherAttr.participant + "</br>";
        description += "????????????: "+  JSON.stringify(otherAttr.state_field_str, null, 4)  + "</br>";

        return styleTooltip(v, description) })
      // .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); });

    var initialScale = 0.75;
    svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));
    svg.attr('height', g.graph().height + 240);


  }

  render() {

    return (
      <Spin spinning={this.state.graphLoading} delay={500}>
        <div style={{ overflow: "scroll" }}>
          <svg width={1024} height={1500}><g/></svg>
        </div>
      </Spin>

    )
  }

}

export default WorkflowGraph;


