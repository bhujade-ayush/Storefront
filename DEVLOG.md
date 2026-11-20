1.  **Issue:** Website not rendering.  
    **Bug:** In ` ScrollToTop ` component, Arrow function was written without curly braces. And the ` window.scrollTo() ` returns a promise which was breaking the render.
    **Fix:** Added curly braces in the arrow function inside ` ScrollToTop ` component.