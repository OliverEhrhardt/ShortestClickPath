
var nodes = []; //global array of all nodes on screen

$(window).ready(windowClick);

function windowClick(e){
	$('body').click(function(e){
		//create node data
		function createNode(){
			var node = {};
			node.X = e.clientX;
			node.Y = e.clientY;
			return node;
		}
		nodes.push(createNode());
		console.log(nodes);
		//display node data
		var nodeContainer = $("<div>").addClass('node');
		$("body").append(nodeContainer);
		nodeContainer.css({
			top: e.clientY - nodeContainer.height()/2,
			left: e.clientX - nodeContainer.width()/2
		});
		//draw lines
		function drawLines(){
			//check if other line is overlapping
			//need math check on this T_T going to go train >.>...
		}
	});
}