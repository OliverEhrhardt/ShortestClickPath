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
		//create edge data
		function createEdge(node){
			var edge = {};
			edge.first = [currNode.X, currNode.Y];
			edge.second = [node.X, node.Y];
			return edge;
		}
		//go through each node and check if edge is possible without overlap
		nodes.forEach(function(node){
			if(node.X != currNode.X && node.Y != currNode.Y){
				var noOverlap = true
				var currEdge = createEdge(node);
				for(var i=0;i<edges.length;i++){
					if(checkOverlap(currEdge, edges[i])){
						noOverlap = false;
						break;
					}
				}
				if(noOverlap){
					edges.push(currEdge);
					var ctx = $('#grid')[0].getContext("2d");
					ctx.strokeStyle = 'black';
					ctx.beginPath();
					ctx.moveTo(currEdge.first[0], currEdge.first[1]);
					ctx.lineTo(currEdge.second[0], currEdge.second[1]);
					ctx.stroke();
				}		
			}
		});
	});
}

//find max x-coordinate of edge
function max(edge){
	if(edge.first[0] > edge.second[0]){
		return edge.first[0];
	}else{
		return edge.second[0];
	}
}
//find min x-coordinate of edge
function min(edge){
	if(edge.first[0] > edge.second[0]){
		return edge.second[0];
	}else{
		return edge.first[0];
	}}


//check if edges overlaps
function checkOverlap(edge1, edge2){
	var a1x = edge1.first[0];
	var a1y = edge1.first[1];
	var a2x = edge1.second[0];
	var a2y = edge1.second[1];
	
	var b1x = edge2.first[0];
	var b1y = edge2.first[1];
	var b2x = edge2.second[0];
	var b2y = edge2.second[1];
	var bounds1, bounds2 = false;
	
	//evaluate special cases
	if((a2x-a1x) == 0){
		xColision = a1x;
	}else if((b2x-b1x) == 0){
		xColision = b1x;
	}else{
		var As = (a2y-a1y)/(a2x-a1x);
		var Bs = (b2y-b1y)/(b2x-b1x);
		var xColision = Math.round((((As*a1x)-a1y-(Bs*b1x)+b1y)/(As-Bs))*100)/100;
	}
	
	if(xColision < max(edge1) && xColision > min(edge1)){
		bounds1 = true;
	}		
	if(xColision < max(edge2) && xColision > min(edge2)){
		bounds2 = true;
	}
	if(bounds1 && bounds2){
		return true;
	}else{
		return false;
	}
}