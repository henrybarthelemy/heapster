
'use client';
import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import "./style.css";
import RuntimeBox from "@/app/runtime-box/runtimebox";

const BinaryTree = () => {
    const [cy, setCy] = useState(null);
    const [nodeValue, setNodeValue] = useState<string>('');
    let head = null;
    let parents = [];
    useEffect(() => {
        // Initialize Cytoscape
        const newCy = cytoscape({
            container: document.getElementById('cy'),
            elements: [
                // nodes
                { data: { id: 'item-1', label: '1' } },
                { data: { id: 'item-2', label: '2' } },
                { data: { id: 'item-3', label: '3' } },

                // edges
                { data: { id: 'edge-1', source: 'item-1', target: 'item-2' } },
                { data: { id: 'edge-2', source: 'item-2', target: 'item-3' } },
                // edges can be removed if not needed
            ],
            style: [
                {
                    selector: 'node:active',
                    style: {
                        'overlay-padding': 0,
                        'overlay-color': 'transparent',
                        'overlay-opacity': 0,
                    }
                },
                {
                    selector: 'node:selected',
                    style: {
                        'border-width': 0,
                        'overlay-padding': 0,
                        'overlay-color': 'transparent',
                        'overlay-opacity': 0,
                    }
                },
                {
                    selector: 'node',
                    style: {
                        'shape': 'round-rectangle',
                        'background-color': '#666',
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'overlay-opacity': 0,
                        'border-width': 0,
                        'width': 50,
                        'height': 50,
                        'cursor': 'default'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc'
                    }
                },
                {
                    selector: 'core',
                    style: {
                        'active-bg-opacity': 0,
                        'active-bg-color': 'transparent',
                        'active-bg-size': 0,



                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'overlay-padding': 0,
                        'overlay-color': 'transparent',
                        'overlay-opacity': 0,
                    }
                }
            ],
            layout: {
                name: 'grid',
                fit: true
            },
            // Interaction options
            userZoomingEnabled: false,
            userPanningEnabled: false,
            boxSelectionEnabled: false,
        });

        newCy.nodes().ungrabify();
        setCy(newCy);
        if (parents.length == 0) {
            parents.push([newCy.nodes()[1], newCy.nodes()[2]])
            parents.push([])
            parents.push([])
            head = newCy.nodes()[0];
        }


        // Function to handle resize
        const handleResize = () => {
            newCy.resize();
            applyTreeLayout(newCy);
        };

        // Add event listener for resize
        window.addEventListener('resize', handleResize);

        // Apply initial layout
        applyTreeLayout(newCy);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            newCy.destroy();
        };
    }, []);

    // Function to layout nodes in a horizontal line
    const applyTreeLayout = (cyInstance) => {
        console.log("running 1")
        const nodes = cyInstance.nodes();
        const containerWidth = cyInstance.container().offsetWidth;
        const containerHeight = cyInstance.container().offsetHeight;
        const spacingX = containerWidth / (nodes.length + 1); // Calculate spacing based on container and node count
        const spacingY = containerHeight / (nodes.length + 1);

        let temp = head;
        let cur = head;
        console.log(cur);
        let children = [];
        let nextChildren = [];
        let layer = 1;
        let layerLength = 0;
        while (cur != null || children.length > 0 || nextChildren.length > 0) {
            console.log("running");
            if (cur != null) {
                // We're at the very top of the tree
                cur.position('x', containerWidth / 2);
                cur.position('y', 0);
                console.log(containerWidth/2, 0);
                parents[cur.id().split("-")[1] - 1].forEach((child) => {
                    children.push(child);
                });
                cur = null;
                layer += 1;
            }
            // We're rendering a row
            layerLength = children.length;
            children.forEach((child => {
                parents[child.id().split("-")[1] - 1].forEach((grandChild) => {
                    nextChildren.push(grandChild);
                });
                child.position({
                    'y': 300,
                    'x': 0
                });
            }));
            children = nextChildren;
            nextChildren = [];
            layer += 1;
        }
        head = temp;
       /*
        nodes.positions((node, index) => {
            let x = containerHeight - (spacingX * (index + 1)); // Calculate x position with equal spacing
            let y = containerHeight - (spacingY * (index + 1)); // Calculate y position with equal spacing
            if (nodes.length === 1) {
                x = containerHeight / 2; // Center the node if it's the only one
                y = containerHeight / 2; // Center the node if it's the only one
            }
            return { x, y };
        });
*/
        // Instead of fit, manually set zoom and pan
        if (nodes.length === 1) {
            // If only one node, center it without zooming in
            cyInstance.zoom({
                level: 1, // Set the zoom level to 1 (or any appropriate level)
                renderedPosition: { x: containerWidth / 2, y: containerHeight / 2 }
            });
        } else {
            // If more than one node, fit them to the screen with padding
            cyInstance.fit(nodes, 50); // Include 50 pixels of padding
        }

        cyInstance.center(nodes); // Center the nodes in the viewport
    };



    const addNodeAndEdge = () => {
        if (!cy) return;

        // Generate a new node ID based on current nodes count
        const newNodeId = `item-${cy.nodes().length + 1}`;
        const label = `${cy.nodes().length + 1}`;
        const nodesToAdd = [{ group: 'nodes', data: { id: newNodeId, label: label } }];

        // Only create an edge if there is at least one node present
        if (cy.nodes().length > 0) {
            const lastNodeId = `item-${cy.nodes().length}`;
            nodesToAdd.push({ group: 'edges', data: { source: lastNodeId, target: newNodeId } });
        }

        // Add the new node, and potentially the edge
        cy.add(nodesToAdd);
        cy.$(`#${newNodeId}`).ungrabify();
        // Re-apply layout
        applyTreeLayout(cy);
    };


    const popNode = () => {
        if (!cy || cy.nodes().length < 1) return;

        // Get the last node
        const lastNode = cy.nodes().last();

        if (cy.nodes().length > 1) {
            // Get the second last node
            const secondLastNode = cy.nodes()[cy.nodes().length - 2];

            // Get the edge between the last node and the second last node
            const edgeToRemove = cy.edges().filter(edge => {
                return (edge.data('source') === secondLastNode.id() && edge.data('target') === lastNode.id()) ||
                    (edge.data('target') === secondLastNode.id() && edge.data('source') === lastNode.id());
            });

            // Remove the last node and the edge connected to it
            cy.remove(lastNode).remove(edgeToRemove);
        } else if (cy.nodes().length === 1) {
            // If there's only one node, just remove it
            cy.remove(lastNode);
        }

        // Re-apply layout
        applyTreeLayout(cy);
    };


    const findElement = () => {

        if (!cy || cy.nodes().length < 1) return;

        const lastNode = cy.nodes().last();

        const flashDuration = 600;
        const delay = 400;
        const nodeFlashColor = 'red';
        const lastNodeFlashColor = 'green'
        const originalNodeColor = '#666'; // Assuming this is the original node color

        // Function to animate the node color

        const flashNode = async (nodeId, flashColor, originalColor, flashDuration, delayDuration) => {
            const node = cy.$(`#${nodeId}`);
            await node.animation({
                style: {'background-color': flashColor},
                duration: flashDuration / 2,
                easing: 'ease-in-out'

            }).play().promise();

            await new Promise(resolve => setTimeout(resolve, delay));

            await node.animation({
                style: {'background-color': originalColor},
                duration: flashDuration / 2,
                easing: 'ease-out' // Easing function for a smooth end
            }).play().promise();
        }
        flashNode(lastNode.id(), 'green', originalNodeColor, flashDuration, delay);
    };


    return (
        <div>
            <div className="title">
                <p>Binary Tree</p>
            </div>

            <div className="cyContainer">
                <div id='cy' className="bg-blue-500" />
            </div>
            <div className="buttonBar">
                <input
                    type="text" // You can also use type "number" here if you prefer
                    value={nodeValue}
                    onChange={(e) => setNodeValue(e.target.value)}
                    placeholder="Enter desired value (0 if empty)"
                    className="nodeIndexInput" // Make sure this class provides adequate styling
                    style = {{color: "black"}}
                />
                <button onClick={findElement}>Find Node</button>
                <button onClick={addNodeAndEdge}>Insert Element</button>
            </div>
            <div className="fullParent">
                <div className="halfChild">
                    <div className="description">
                        <p>
                            A binary tree is a hierarchical data structure that consists of nodes connected by edges.
                            Each node in a binary tree has at most two children, which are referred to as the left child
                            and the right child. Nodes in a binary tree are typically called "parent," "left child,"
                            and "right child" nodes. Leaf nodes have no children. They offer efficient ways to organize
                            and search data in a hierarchical manner, especially when they are balanced
                        </p>
                    </div>
                </div>
                <div className="halfChild">
                    <RuntimeBox stats={runtime}></RuntimeBox>
                </div>
            </div>
        </div>
    )
};

const runtime = {
    "insert": "O(log(n))",
    "find" : "O(log(n))",
}
export default BinaryTree;
