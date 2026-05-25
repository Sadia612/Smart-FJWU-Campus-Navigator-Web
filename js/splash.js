// Redirect to main page after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    console.log('Splash screen loaded - redirecting in 5 seconds');
    
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 5000);
});

// Prevent any user interaction
document.addEventListener('click', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    e.preventDefault();
});