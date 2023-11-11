
'use client';
import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';

const Cyto = () => {
  const [cy, setCy] = useState(null);

  useEffect(() => {
    // Initialize Cytoscape
    const newCy = cytoscape({
      container: document.getElementById('cy'),
      elements: [
        // nodes
        { data: { id: 'item-1', label: '10' } },
        { data: { id: 'item-2', label: '20' } },
        { data: { id: 'item-3', label: '30' } },
        
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
    // make the node initially transparent
    cy.$(`#${newNodeId}`).style('opacity', 0);
    // make edge initially transparent
    if (cy.nodes().length > 1) {
      const edgeId = `edge-${cy.nodes().length - 1}`;
      cy.$(`#${edgeId}`).style('opacity', 0);
    }

  

  const animationDuration = 500;
  const flashDuration = 300;
  const nodeColor = 'red';
  const edgeColor = 'purple';
  const originalNodeColor = '#666'; // the original color of your nodes
  const originalEdgeColor = '#ccc'; // the original color of your edges

  // Function to animate the node color
  const animateNodeColor = (nodeId, color, duration) => {
    cy.$(`#${nodeId}`).animate({
      style: { 'background-color': color },
      duration: duration
    });
  };

  // Function to animate the edge color
  const animateEdgeColor = (edgeId, color, duration) => {
    cy.$(`#${edgeId}`).animate({
      style: { 'line-color': color },
      duration: duration
    });
  };

  // Perform animation
  const performAnimation = async () => {
    for (let i = 1; i < cy.nodes().length; i++) {
      const currentNodeId = `item-${i}`;
      const currentEdgeId = `edge-item-${i + 1}`;
      
      // Flash node color
      animateNodeColor(currentNodeId, nodeColor, flashDuration);
      await new Promise(resolve => setTimeout(resolve, flashDuration));
      animateNodeColor(currentNodeId, originalNodeColor, flashDuration);

      // Wait for node flash animation to complete before starting edge animation
      await new Promise(resolve => setTimeout(resolve, flashDuration));

      if (i < cy.nodes().length - 1) {
        // Flash edge color
        animateEdgeColor(currentEdgeId, edgeColor, flashDuration);
        await new Promise(resolve => setTimeout(resolve, flashDuration));
        animateEdgeColor(currentEdgeId, originalEdgeColor, flashDuration);
      }
    }
  };

  // Start animation
    performAnimation();

    // Re-apply layout
    applyHorizontalLayout(cy);
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
  

  return (
    <div>
    <button onClick={addNodeAndEdge}>Add Node</button>
    <button onClick={removeLastNodeAndEdge}>Remove Node</button>
    <div id='cy' style={{ width: '100%', height: '100vh' }} className="bg-blue-500" />
  </div>
  )
};

export default Cyto;
