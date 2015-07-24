/*
	Notes:
	some edges won't draw because of overlap detection when there is
	no posible edge overlap between the two points. 
*/
var nodes = []; //global array of all nodes on screen
var edges = []; //global array of all edges on screen

$(window).ready(windowClick);

function windowClick(e){
	$('#grid').attr("height", $(document).height());
	$('#grid').attr("width", $(document).width());
	$('body').click(function(e){
		//display node data
		var nodeContainer = $("<div>").addClass('node');
		$("body").append(nodeContainer);
		nodeContainer.css({
			top: e.clientY - nodeContainer.height()/2,
			left: e.clientX - nodeContainer.width()/2
		});
		//create node data
		function createNode(){
			var node = {};
			node.X = e.clientX;
			node.Y = e.clientY;
			return node;
		}
		var currNode = createNode();
		nodes.push(currNode);
		//console.log(nodes);
		//create edge data
		function createEdge(node){
			var edge = {};
			edge.first = [currNode.X, currNode.Y];
			edge.second = [node.X, node.Y];
			return edge;
		}
		//console.log(nodes);
		nodes.forEach(function(node){
			if(node.X != e.clientX && node.Y != e.clientY){
				var noOverlap = true
				var currEdge = createEdge(node);
				for(var i=0;i<edges.length;i++){
					//console.log(checkOverlap(currEdge, edges[i]));
					if(checkOverlap(currEdge, edges[i])){
						noOverlap = false;
					}
				}
				if(noOverlap){
					edges.push(currEdge);
					var ctx = $('#grid')[0].getContext("2d");
					ctx.beginPath();
					ctx.moveTo(currEdge.first[0], currEdge.first[1]);
					ctx.lineTo(currEdge.second[0], currEdge.second[1]);
					ctx.stroke();
					//console.log(edges);
				}else{
					delete currEdge;
				}
			}
			
		});
		
	});
}


//check if edges overlaps
function checkOverlap(edge1, edge2){
	slope1 = (edge1.second[1] - edge1.first[1])/(edge1.second[0]- edge1.first[0]);
	slope2 = (edge2.second[1] - edge2.first[1])/(edge2.second[0]- edge2.first[0]);
	yInt1 = edge1.first[1] - (slope1*edge1.first[0]);
	yInt2 = edge2.first[1] - (slope2*edge2.first[0]);
	
	var xColision = (yInt2 - yInt1)/(slope1 - slope2);
	xColision = xColision.toFixed(2);
	
	var max = 0;
	var min = 0;
	if(edge1.first[0] > edge1.second[0]){
		max = edge1.first[0];
		min = edge1.second[0];
	}else{
		max = edge1.second[0];
		min = edge1.first[0];
	}
	
	//console.log(max, min, xColision, yInt1, yInt2);
	//console.log(slope1, slope2, yInt1, yInt2)
	
	if(xColision < max && xColision > min){
		//console.log(max, min, xColision, edge2);
		return true;
	}else{
		//console.log(false);
		return false;
	}
	
}