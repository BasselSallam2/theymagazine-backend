// Dashboard JavaScript

// Auto-generate slug from title/name
function autoGenerateSlug(sourceId, targetId) {
    const source = document.getElementById(sourceId);
    const target = document.getElementById(targetId);

    if (source && target) {
        source.addEventListener('input', function() {
            const slug = this.value
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single
                .trim();
            target.value = slug;
        });
    }
}

// Initialize slug generation for posts
document.addEventListener('DOMContentLoaded', function() {
    // Post title to slug
    autoGenerateSlug('title', 'slug');

    // Category name to slug
    autoGenerateSlug('name', 'slug');

    // Navbar title to slug
    autoGenerateSlug('title', 'slug');
});

// Confirm delete actions
function confirmDelete(message = 'Are you sure you want to delete this item?') {
    return confirm(message);
}

// Auto-submit forms with confirmation
document.addEventListener('DOMContentLoaded', function() {
    const deleteForms = document.querySelectorAll('form[onsubmit]');
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const onsubmitAttr = form.getAttribute('onsubmit');
            if (onsubmitAttr && onsubmitAttr.includes('confirm')) {
                const message = onsubmitAttr.match(/confirm\('([^']+)'\)/);
                if (message && !confirm(message[1])) {
                    e.preventDefault();
                    return false;
                }
            }
        });
    });
});

// Image preview functionality (for posts)
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('previewImg');
            const previewContainer = document.getElementById('imagePreview');

            if (preview && previewContainer) {
                preview.src = e.target.result;
                previewContainer.classList.remove('d-none');
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function removeImage() {
    const fileInput = document.getElementById('imageFile');
    const previewContainer = document.getElementById('imagePreview');

    if (fileInput) fileInput.value = '';
    if (previewContainer) previewContainer.classList.add('d-none');
}

// HTML Editor functionality (for posts)
function formatText(command, value = null) {
    document.execCommand(command, false, value);
    const editor = document.getElementById('editor');
    if (editor) editor.focus();
}

function insertLink() {
    const url = prompt('Enter URL:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
    const editor = document.getElementById('editor');
    if (editor) editor.focus();
}

function insertImage() {
    const url = prompt('Enter image URL:');
    if (url) {
        document.execCommand('insertImage', false, url);
    }
    const editor = document.getElementById('editor');
    if (editor) editor.focus();
}

function updateHiddenTextarea() {
    const editor = document.getElementById('editor');
    const textarea = document.getElementById('content');

    if (editor && textarea) {
        textarea.value = editor.innerHTML;
    }
}

// Initialize editor on load
document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('editor');
    if (editor) {
        updateHiddenTextarea();
        editor.addEventListener('input', updateHiddenTextarea);
        editor.addEventListener('keyup', updateHiddenTextarea);
        editor.addEventListener('paste', function() {
            setTimeout(updateHiddenTextarea, 100);
        });
    }
});
