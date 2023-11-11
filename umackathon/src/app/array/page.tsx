'use client';
import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import "./style.css";
import RuntimeBox from "@/app/runtime-box/runtimebox";


const Cyto = () => {
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const [nodeIndex, setNodeIndex] = useState<string>('');

  useEffect(() => {
    // Initialize Cytoscape
    const newCy = cytoscape({
      container: document.getElementById('cy'),
      elements: [
        // nodes
        { data: { id: 'item-0', label: '10' } },
        { data: { id: 'item-1', label: '20' } },
        { data: { id: 'item-2', label: '30' } },
        
        // edges
        { data: { id: 'edge-0', source: 'item-0', target: 'item-1' } },
        { data: { id: 'edge-1', source: 'item-1', target: 'item-2' } },

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
            'line-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',

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
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'target-arrow-color': '#ccc'
            
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
      applyHorizontalLayout(newCy);
    };

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Apply initial layout
    applyHorizontalLayout(newCy);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      newCy.destroy();
    };
  }, []);

  // Function to layout nodes in a horizontal line
  const applyHorizontalLayout = (cyInstance) => {
    const nodes = cyInstance.nodes();
    const containerWidth = cyInstance.container().offsetWidth;
    const containerHeight = cyInstance.container().offsetHeight;
    const nodeWidth = 50; // Fixed node width
    const spacing = containerWidth / (nodes.length + 1); // Calculate spacing based on container width and node count
  
    nodes.positions((node, index) => {
      let x = spacing * (index + 1); // Calculate x position with equal spacing
      if (nodes.length === 1) {
        x = containerWidth / 2; // Center the node if it's the only one
      }
      return {
        x,
        y: containerHeight / 2 // Center y position
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
  

  const addNodeAtIndex = async (index: number) => {
    // ... your existing logic to add a node, modified to use index

    
  };

  const removeNodeAtIndex = (index: number) => {
    if (!cy) return;
  
    const nodeIdToRemove = `item-${index}`;
    const nodeToRemove = cy.getElementById(nodeIdToRemove);
  
    if (nodeToRemove.length > 0) {
      // Get the predecessor and successor nodes
      const previousNode = nodeToRemove.incomers().nodes();
      const nextNode = nodeToRemove.outgoers().nodes();
  
      // Get all connected edges
      const connectedEdges = nodeToRemove.connectedEdges();
  
      // Remove the node and the connected edges
      connectedEdges.remove();
      nodeToRemove.remove();
  
      // If there are nodes before and after the one that was removed, connect them
      if (previousNode.length > 0 && nextNode.length > 0) {
        cy.add({
          group: "edges",
          data: {
            // Generate a new ID for the edge
            id: `edge-${previousNode.id()}-${nextNode.id()}`,
            source: previousNode.id(),
            target: nextNode.id()
          }
        });
      }

      // now reindex the nodes
      const nodes = cy.nodes();
      nodes.forEach((node, index) => {
        node.data('label', `${index + 1}`);
      });
  
      // Reapply the layout if necessary
      applyHorizontalLayout(cy);
    } else {
      console.warn(`No node found at index ${index}`);
    }
  };
  
  
  const animateNode = async (nodeId: string, flashColor: string, originalColor: string, flashDuration: number) => {
    const node = cy.getElementById(nodeId);
    // Flash the node with the specified color
    node.style('background-color', flashColor);
    await node.animation({
      style: { 'background-color': originalColor },
      duration: flashDuration,
      easing: 'ease-in-out-cubic'
    }).play().promise();
  };

  const addNodeAndEdge = async () => {
    if (!cy) return;
  
    // Calculate the new node ID based on the current number of nodes
    const totalNodes = cy.nodes().length;
    const newNodeId = `item-${totalNodes}`;
  
    // Add the new node with initial opacity as 0 (invisible)
    cy.add({
      group: 'nodes',
      data: { id: newNodeId, label: `${totalNodes + 1}` },
      style: { opacity: 0 }
    });
  
    // If this is not the first node, add an edge from the last node to the new node
    if (totalNodes > 0) {
      const newEdgeId = `edge-${totalNodes - 1}-${totalNodes}`;
      cy.add({
        group: 'edges',
        data: {
          id: newEdgeId,
          source: `item-${totalNodes - 1}`,
          target: newNodeId
        },
        style: { opacity: 0 }
      });
    }
  
    // Ensure new elements are grabbable if needed
    cy.getElementById(newNodeId).grabify();
  
    // Reveal the new node and edge
    cy.getElementById(newNodeId).style('opacity', 0);
    cy.getElementById(`edge-${totalNodes - 1}-${totalNodes}`).style('opacity', 0);

  

    
    iterateNodes();
    applyHorizontalLayout(cy);

    
  };

  const iterateNodes = async () => {
    const lastNodeIndex = cy.nodes().length - 1;
  
    // Iterate through all nodes
    for (let i = 0; i < cy.nodes().length; i++) {
      const currentNodeId = `item-${i}`;
      
      // Flash the current node
      if (i < lastNodeIndex) {
        // If it's not the last node, flash with red then back to original color
        await animateNode(currentNodeId, 'red', '#666', 600);
      } else {
        // If it's the last node, flash with green and make sure it's visible
        cy.getElementById(currentNodeId).style('opacity', 1);
        
        // Find the last edge connected to this node if it exists
        if (i > 0) {
          const lastEdgeId = `edge-${i - 1}-${i}`;
          cy.getElementById(lastEdgeId).style('opacity', 1);
        }
  
        await animateNode(currentNodeId, '#666', 'green', 800);
      }
  
      // Add a delay between animations if necessary
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };
  

  
  

  const removeLastNodeAndEdge = () => {
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
    applyHorizontalLayout(cy);
  };

  const handleAddNodeClick = async () => {
    if (nodeIndex.trim() === '') {
      // If textbox is empty, call addNodeAndEdge directly
      await addNodeAndEdge();
    } else {
      const index = parseInt(nodeIndex, 10);
      if (!isNaN(index) && cy) {
        await addNodeAtIndex(index);
      }
    }
    // Re-apply layout to place nodes correctly
    applyHorizontalLayout(cy);
  };
  
  const handlePopNodeClick = () => {
    if (nodeIndex.trim() === '') {
      // If textbox is empty, call removeNodeAndEdge directly
      removeLastNodeAndEdge();
    } else {
      const index = parseInt(nodeIndex, 10);
      if (!isNaN(index) && cy) {
        removeNodeAtIndex(index);
      }
    }
    // Re-apply layout to place nodes correctly
    applyHorizontalLayout(cy);
  };
  
  

  return (
    <div>
      <div className="title">
        <p>Array</p>
      </div>
      <div className="cyContainer">
        <div id="cy" className="bg-blue-500" />
      </div>
      <div className="buttonBar">
        <input
            type="text" // You can also use type "number" here if you prefer
            value={nodeIndex}
            onChange={(e) => setNodeIndex(e.target.value)}
            placeholder="Enter desired index (0 if empty)"
            className="nodeIndexInput" // Make sure this class provides adequate styling
            style = {{color: "black", }}

          />

        <button onClick={handleAddNodeClick}>Add Node</button>
        <button onClick={handlePopNodeClick}>Pop Node</button>
      </div>

      <div className="fullParent">
        <div className="halfChild">
          <div className="description">
            <p>
              An array is a fundamental data structure that represents a
              collection of elements (values or variables), each identified by
              at least one array index or key. Arrays are used to store multiple
              values in a single variable, which allows for efficient access to
              elements based on their index.
            </p>
          </div>
        </div>

        <div className="halfChild">
          <RuntimeBox stats={runtime}></RuntimeBox>
        </div>
      </div>
    </div>
  );
};

const runtime = {
  "inserting / deletion of an element at the front" : "O(n)",
  "inserting / deletion of an element at the end" : "O(1)",
  "searching for an element" : "O(n)",

}

export default Cyto;

