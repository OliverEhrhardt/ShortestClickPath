var nodes = []; //global array of all nodes on screen
var edges = []; //global array of all edges on screen
var isDrag = false; //check drag
var startNode, endNode; //start and end node of pathfinding algorithm

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
			node.dist = Infinity;
			node.prev = null;
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
			startNode.dist = 0;
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
			edge.len = getDistance(currNode, node);
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
				//if no overlap draw edge :3
				if(noOverlap){
					var ctx = $('#grid')[0].getContext("2d");
					ctx.beginPath();
					ctx.moveTo(currEdge.first.X, currEdge.first.Y);
					ctx.lineTo(currEdge.second.X, currEdge.second.Y);
					ctx.lineWidth = 0;
					ctx.strokeStyle = 'black';
					ctx.stroke();
					currEdge.brush = ctx;
					edges.push(currEdge);
					currEdge.first.adj.push(currEdge);
					currEdge.second.adj.push(currEdge);

				}		
			}
		});
		if(endNode){
			findShortestPath();
			displayShortestPath(endNode);
		}
	});
}

$(window).ready(main);

/* HELPER FUNCTIONS */

//init nodes
function initNodes(){
	nodes.forEach(function(node){
		if(node.prev != null) node.prev = null;
		if(node.visited != false) node.visited = false;
		if(node == startNode) node.dist = 0;
		else node.dist = Infinity;
	});
}
//clears path on doc
function clearPath(node){
	if(node.prev != null){
		var ctx = $('#grid')[0].getContext('2d');
		//erase previous 
		ctx.beginPath();
		ctx.moveTo(node.X,node.Y);
		ctx.lineTo(node.prev.X, node.prev.Y);
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'white';
		ctx.stroke();
		//draw old path
		ctx.beginPath();
		ctx.moveTo(node.X,node.Y);
		ctx.lineTo(node.prev.X, node.prev.Y);
		ctx.lineWidth = 0;
		ctx.strokeStyle = 'black';
		ctx.stroke();
		clearPath(node.prev);
	}
}
//displays shortest path on doc
function displayShortestPath(node){
	if(node.prev != null){
		var ctx = $('#grid')[0].getContext('2d');
		//erase previous 
		ctx.beginPath();
		ctx.moveTo(node.X,node.Y);
		ctx.lineTo(node.prev.X, node.prev.Y);
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'white';
		ctx.stroke();
		//draw new path
		ctx.beginPath();
		ctx.moveTo(node.X,node.Y);
		ctx.lineTo(node.prev.X, node.prev.Y);
		ctx.lineWidth = 0;
		ctx.strokeStyle = 'yellow';
		ctx.stroke();
		/*
if(node.prev != endNode && node.prev != startNode){
			node.prev.css({
				background-color: 'red'
			});
		}
*/
		
		displayShortestPath(node.prev);
	}
}

//Dijkstra's Algorithm - highlights shortest path
function findShortestPath(){
	//var queue = nodes.slice();
	while(endNode.visited != true){
		var currNode = {adj : [], dist: Infinity};
		nodes.forEach(function(node){
			//console.log(node);
			if(node.dist < currNode.dist && node.visited == false){
				currNode = node;
			};
		});
		currNode.visited = true;
		//queue.splice(queue.indexOf(currNode), 1);
		//console.log(currNode);
		//if(currNode == endNode)console.log('end, ', currNode);
		/*
var shortestEdge = {length: Infinity};
		var nearestNode;
*/
		currNode.adj.forEach(function(edge){
			var alt = currNode.dist + edge.len;
			function updateDistance(node){
				if(alt < node.dist){
					node.dist = alt;
					node.prev = currNode;
				}
			}
			if(edge.first == currNode){
				updateDistance(edge.second)
			}else{
				updateDistance(edge.first);
			}
			/*
if(edge.length < shortestEdge.length){
				shortestEdge = edge;
				if(shortestEdge.first = currNode){
					nearestNode = shortestEdge.second;
				}else{
					nearestNode = shortestEdge.first;
				}
			}
			if(edge.first != currNode){
				var distance = edge.second.dist + edge.len;
				if(distance < edge.first.dist){
					edge.first.dist = distance;
				}
			}else{
				var distance = edge.first.dist + edge.len;
				if(distance < edge.second.dist){
					edge.second.dist = distance;
				}
				
			}
*/
		});
	}
}

//drag function for start and end nodes
function makeDraggable(el){
	el.on('mousedown', function(){
		isDrag = true;
		clearPath(endNode);
		initNodes();
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
				clearPath(endNode);
				initNodes();
				findShortestPath();
				displayShortestPath(endNode);
			}, 500);
			//set starting and ending nodes
			if(el.hasClass('start')){
				//changing old node to normal node
				startNode.dist = Infinity;
				//setting new node and changing properties
				nearestNode.dist = 0;
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
