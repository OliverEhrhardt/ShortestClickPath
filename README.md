# ShortestClickPath
Project : Shortest Path Generator

Summary : A web page that when the body is clicked nodes appear and connect each other with edges.
Edges cannot cross over any pre-existing edges as to not mess with the shortest path algorithm. Two specific nodes
(green and red color) represent the start and end nodes that the shortest path algorithm must use to compute. It then
highlights the shortest path between these two specific nodes.

How to Use : All you must do is clone this repository onto your computer and open the 'index.html' (no quotes) file in your favorite browser.
Note that this may not be supported on your browser so the recommendation is to use Google Chrome. Then all you must do is click
on the body of the document and nodes will appear. The green outlined node is the start node, and the red outlined node is the
end node. Using Dajikstra's Algorithm it computes the shortest path between these two nodes through every other node you create.
Simply drag the start and end to change which node is the start and end.

Bugs: Some nodes may appear to not connect to each other, but is simply the effect of two other nodes that have connected in
front of the node blocking the other node's path. The blocking edge is so close to the node that you can barley see it.
