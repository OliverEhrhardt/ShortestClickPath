var nodes = []; //global array of all nodes on screen
var edges = []; //global array of all edges on screen
var isDrag = false; //check drag
var startNode, endNode; //start and end node of pathfinding algorithm

//Dijkstra's Algorithm - highlights shortest path
function shortestPath(start, end){
	
}

//drag function for start and end nodes
function makeDraggable(el){
	el.on('mousedown', function(){
		isDrag = true;
		$('body').on('mousemove', function(moveEvent){
			el.css({
				top: moveEvent.clientY - el.height()/2,
				left: moveEvent.clientX - el.width()/2
			});
		});
		$('body').on('mouseup', function(upEvent){
			setTimeout(function(){
				isDrag = false;
			});
			$('body').off('mousemove mouseup');
			var min = Infinity;
			var nearestNode;
			nodes.forEach(function(node){
				var dist = getDistance(node, {X : upEvent.clientX, Y : upEvent.clientY});
				if(dist < min){
					min = dist
					nearestNode = node; 
				}
			});
			el.css({
				top: nearestNode.Y - 10,
				left: nearestNode.X - 10,
				transition: '0.5s all'
			});
			setTimeout(function(){
				el.css({
					transition: 'none'
				});
			}, 500);
			//set starting and ending nodes
			if(el.hasClass('start')){
				startNode = nearestNode;
			}
			if(el.hasClass('end')){
				endNode = nearestNode;
			}
		});
	});
}
//distance function
function getDistance(node1, node2){
	return Math.sqrt(Math.pow(node2.Y - node1.Y, 2) + Math.pow(node2.X - node1.X, 2));
}

//find max x-coordinate of edge
function max(edge){
	if(edge.first.X > edge.second.X){
		return edge.first.X;
	}else{
		return edge.second.X;
	}
}
//find min x-coordinate of edge
function min(edge){
	if(edge.first.X < edge.second.X){
		return edge.first.X;
	}else{
		return edge.second.X;
	}
}


//check if edges overlaps
function checkOverlap(edge1, edge2){
	var a1x = edge1.first.X;
	var a1y = edge1.first.Y;
	var a2x = edge1.second.X;
	var a2y = edge1.second.Y;
	
	var b1x = edge2.first.X;
	var b1y = edge2.first.Y;
	var b2x = edge2.second.X;
	var b2y = edge2.second.Y;
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

function main(e){
	$('#grid').attr("height", $(document).height());
	$('#grid').attr("width", $(document).width());
	
	$('body').click(function(e){
	
		//check drag
		if(isDrag) return false;
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
			node.adj = [];
			node.visited = false;
			return node;
		}
		var currNode = createNode();
		nodes.push(currNode);
		//create start and end nodes
		if(nodes.length == 1){
			var start = $("<div>").addClass('start');
			makeDraggable(start);
			$('body').append(start);
			start.css({
				top: currNode.Y - start.height()/2,
				left: currNode.X - start.width()/2,
				border: '2px solid green'
			});
			startNode = currNode;
		}else if(nodes.length == 2){
			var end = $("<div>").addClass('end');
			makeDraggable(end);
			$('body').append(end);
			end.css({
				top: currNode.Y - end.height()/2,
				left: currNode.X - end.width()/2,
				border: '2px solid red'
			});
			endNode = currNode;
		}
		//create edge data
		function createEdge(node){
			var edge = {};
			edge.first = currNode;
			edge.second = node;
			edge.dist = getDistance(currNode, node);
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
					var ctx = $('#grid')[0].getContext("2d");
					ctx.strokeStyle = 'black';
					ctx.beginPath();
					ctx.moveTo(currEdge.first.X, currEdge.first.Y);
					ctx.lineTo(currEdge.second.X, currEdge.second.Y);
					ctx.stroke();
					currEdge.brush = ctx;
					edges.push(currEdge);
					currNode.adj.push(currEdge);

				}		
			}
		});
	});
}

$(window).ready(main);