# ShortestClickPath
Project : Shortest Path Generator

Summary : A web page that when the body is clicked nodes appear and connect each other with edges.
Edges cannot cross over any pre-existing edges as to not mess with the shortest path algorithm. Two specific nodes
(green and red color) represent the start and end nodes that the shortest path algorithm must use to compute. It then
highlights the shortest path between these two specific nodes.

How to Use : All you must do is clone this repository onto your computer and open the 'index.html' (no quotes) file in your favorite browser.
Note that this may not be supported on your browser so the recommendation is to use Google Chrome.

Bugs: The only bug that rarely pops up is that sometimes when two nodes have the exact x or y coordinates on the map, they fail to draw an edge between each other. A quick fix is by putting another node in-between them.