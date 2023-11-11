
'use client';
import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import "./style.css";
import RuntimeBox from "@/app/runtime-box/runtimebox";

const Stack = () => {
    const [cy, setCy] = useState(null);

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

        // Function to handle resize
        const handleResize = () => {
            newCy.resize();
            applyVerticalLayout(newCy);
        };

        // Add event listener for resize
        window.addEventListener('resize', handleResize);

        // Apply initial layout
        applyVerticalLayout(newCy);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            newCy.destroy();
        };
    }, []);

    // Function to layout nodes in a horizontal line
    const applyVerticalLayout = (cyInstance) => {
        const nodes = cyInstance.nodes();
        const containerWidth = cyInstance.container().offsetWidth;
        const containerHeight = cyInstance.container().offsetHeight;
        const nodeHeight = 50; // Fixed node height
        const spacing = containerHeight / (nodes.length + 1); // Calculate spacing based on container width and node count

        nodes.positions((node, index) => {
            let y = containerHeight - (spacing * (index + 1)); // Calculate x position with equal spacing
            if (nodes.length === 1) {
                y = containerHeight / 2; // Center the node if it's the only one
            }
            return {
                x: containerWidth / 2,
                y
            };
        });

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
        applyVerticalLayout(cy);
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
        applyVerticalLayout(cy);
    };


    const peek = () => {

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
                <p>Stack</p>
            </div>

            <div className="cyContainer">
                <div id='cy' className="bg-blue-500" />
            </div>
            <div className="buttonBar">
                <button onClick={addNodeAndEdge}>Add Node</button>
                <button onClick={popNode}>Pop Stack</button>
                <button onClick={peek}>Peek Stack</button>
            </div>
            <div className="fullParent">
                <div className="halfChild">
                    <div className="description">
                        <p>
                            A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle.
                            It is a collection of elements with two main operations: "push," which adds an element to the top of the stack,
                            and "pop," which removes the top element from the stack. Additionally, a "peek" operation allows you to access
                            the top element without removing it. Stacks are commonly used in various computing applications and are fundamental
                            to many algorithms and data structures.
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
    "push to front" : "O(1)",
    "push to back" : "O(n)",
    "peek" : "O(1)",
    "pop" : "O(1)",
    "find element": "O(n)",
}
export default Stack;
