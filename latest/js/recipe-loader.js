document.addEventListener('DOMContentLoaded', function() {
  // Original loadRecipe function
  function loadRecipe() {
    const recipeName = new URLSearchParams(window.location.search).get('recipe');
    console.log('Loading recipe:', recipeName); // Debug log
    
    if (!recipeName) {
      console.error('No recipe name provided in URL');
      document.querySelector('.recipe-title').textContent = "Recipe Not Found";
      document.querySelector('.recipe-description').textContent = 
        "Please select a recipe from our collection.";
      return;
    }
    
    const recipe = recipes[recipeName];
    console.log('Found recipe:', recipe); // Debug log
    
    if (recipe) {
      try {
        // Update basic recipe info
        document.querySelector('.recipe-hero-img').src = recipe.image;
        document.querySelector('.recipe-title').textContent = recipeName;
        document.querySelector('.recipe-description').textContent = recipe.description;
        document.querySelector('.prep-time').textContent = recipe.prepTime;
        document.querySelector('.cook-time').textContent = recipe.cookTime;
        document.querySelector('.servings').textContent = recipe.servings;
        
        // Update ingredients
        const ingredientsContainer = document.getElementById('ingredients-container');
        ingredientsContainer.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
          const li = document.createElement('li');
          li.className = 'single-ingredient';
          li.textContent = ingredient;
          ingredientsContainer.appendChild(li);
        });
        
        // Update tools
        const toolsContainer = document.getElementById('tools-container');
        toolsContainer.innerHTML = '';
        recipe.tools.forEach(tool => {
          const li = document.createElement('li');
          li.className = 'single-tool';
          li.textContent = tool;
          toolsContainer.appendChild(li);
        });
        
        // Update instructions
        const instructionsContainer = document.getElementById('instructions-container');
        instructionsContainer.innerHTML = '';
        recipe.instructions.forEach((instruction, index) => {
          const div = document.createElement('div');
          div.className = 'single-instruction';
          
          const header = document.createElement('header');
          const stepP = document.createElement('p');
          stepP.textContent = `${index + 1}.`;
          const divider = document.createElement('div');
          
          header.appendChild(stepP);
          header.appendChild(divider);
          
          const instructionP = document.createElement('p');
          instructionP.textContent = instruction;
          
          div.appendChild(header);
          div.appendChild(instructionP);
          
          instructionsContainer.appendChild(div);
        });
      } catch (error) {
        console.error('Error loading recipe:', error);
        document.querySelector('.recipe-title').textContent = "Error Loading Recipe";
        document.querySelector('.recipe-description').textContent = 
          "There was an error loading the recipe. Please try again later.";
      }
    } else {
      console.error('Recipe not found:', recipeName);
      document.querySelector('.recipe-title').textContent = "Recipe Not Found";
      document.querySelector('.recipe-description').textContent = 
        "Sorry, we couldn't find the recipe you're looking for. Please try another recipe from our collection.";
    }
  }
  
  // Set copyright year
  document.getElementById('date').textContent = new Date().getFullYear();
  
  // Load the recipe
  loadRecipe();
  
  // PDF Generation Function
  function generatePDF(preview = false) {
    const { jsPDF } = window.jspdf;
    const recipeName = document.querySelector('.recipe-title').textContent;
    const recipeDesc = document.querySelector('.recipe-description').textContent;
    const prepTime = document.querySelector('.prep-time').textContent;
    const cookTime = document.querySelector('.cook-time').textContent;
    const servings = document.querySelector('.servings').textContent;
    
    // Create PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;
    
    // Add Logo and Website Name
    const logoUrl = './assets/logo.png'; // Adjust path if needed
    
    // Add Website Name as Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Use a color that matches your brand
    doc.text("Pimp Ur Food", pageWidth / 2, yPos, { align: "center" });
    
    // Add Recipe Title
    yPos += 20;
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(recipeName, pageWidth / 2, yPos, { align: "center" });
    
    // Add Description
    yPos += 10;
    doc.setFontSize(11);
    const descriptionLines = doc.splitTextToSize(recipeDesc, pageWidth - 40);
    doc.text(descriptionLines, 20, yPos);
    
    // Add Recipe Info
    yPos += descriptionLines.length * 6 + 10;
    doc.setFontSize(12);
    doc.text(`Prep Time: ${prepTime}`, 20, yPos);
    yPos += 8;
    doc.text(`Cook Time: ${cookTime}`, 20, yPos);
    yPos += 8;
    doc.text(`Servings: ${servings}`, 20, yPos);
    
    // Add Ingredients
    yPos += 15;
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("Ingredients", 20, yPos);
    
    // Get ingredients
    const ingredients = [];
    document.querySelectorAll('#ingredients-container .single-ingredient').forEach(el => {
      ingredients.push(el.textContent);
    });
    
    // Add ingredients list
    yPos += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    ingredients.forEach(ingredient => {
      doc.text(`• ${ingredient}`, 25, yPos);
      yPos += 6;
      
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Add Tools
    yPos += 6;
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("Tools", 20, yPos);
    
    // Get tools
    const tools = [];
    document.querySelectorAll('#tools-container .single-tool').forEach(el => {
      tools.push(el.textContent);
    });
    
    // Add tools list
    yPos += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    tools.forEach(tool => {
      doc.text(`• ${tool}`, 25, yPos);
      yPos += 6;
      
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Add Instructions
    yPos += 6;
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("Instructions", 20, yPos);
    
    // Get instructions
    const instructions = [];
    document.querySelectorAll('.single-instruction p:not(:first-child)').forEach((el, index) => {
      instructions.push(`${index + 1}. ${el.textContent}`);
    });
    
    // Add instructions list
    yPos += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    instructions.forEach(instruction => {
      const instructionLines = doc.splitTextToSize(instruction, pageWidth - 45);
      doc.text(instructionLines, 25, yPos);
      yPos += instructionLines.length * 6 + 3;
      
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Add footer with website URL
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const footerText = "www.zestyhaven.com | Elevate your everyday meals";
    doc.text(footerText, pageWidth / 2, 285, { align: "center" });
    
    // Save the PDF
    if (preview) {
      return doc.output('datauristring');
    } else {
      doc.save(`${recipeName.replace(/\s+/g, '_')}_recipe.pdf`);
    }
  }
  
  // Modal functionality
  const modal = document.getElementById('pdf-preview-modal');
  const closeModal = document.querySelector('.close-modal');
  const cancelBtn = document.getElementById('cancel-download');
  const downloadConfirmBtn = document.getElementById('download-confirm');
  const pdfPreview = document.getElementById('pdf-preview');
  
  function showModal() {
    modal.style.display = 'block';
    const pdfData = generatePDF(true);
    pdfPreview.src = pdfData;
  }
  
  function hideModal() {
    modal.style.display = 'none';
  }
  
  // Event listeners for modal
  closeModal.addEventListener('click', hideModal);
  cancelBtn.addEventListener('click', hideModal);
  downloadConfirmBtn.addEventListener('click', () => {
    generatePDF();
    hideModal();
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      hideModal();
    }
  });
  
  // Add event listener to download button
  const downloadBtn = document.getElementById('download-recipe');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', showModal);
  }
});