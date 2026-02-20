import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Plus, X, Save, ArrowUp, ArrowDown, EyeOff, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  showOnHome?: boolean;
  homeOrder?: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { user } = useAuth();

  const isAdmin = user?.isAdmin;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    showOnHome: false,
    homeOrder: 0,
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const result = await response.json();

        if (result.success && result.data) {
          // Transform API data to match Category interface
          const transformedCategories: Category[] = result.data.map((cat: any) => ({
            _id: cat.id,
            name: cat.name,
            description: cat.description || '',
            image: cat.image || '/api/placeholder/400/300',
            productCount: 0, // You can add product count from products API if needed
            showOnHome: cat.show_on_home || false,
            homeOrder: cat.home_order || 0,
          }));

          setCategories(transformedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        image: category.image,
        showOnHome: category.showOnHome || false,
        homeOrder: category.homeOrder || 0,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        showOnHome: false,
        homeOrder: categories.length + 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '', showOnHome: false, homeOrder: 0 });
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        // Update existing category
        const response = await fetch(`http://localhost:5000/api/categories/${editingCategory._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            image: formData.image,
            showOnHome: formData.showOnHome,
            homeOrder: formData.homeOrder,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Update the category in state
          setCategories(categories.map(cat =>
            cat._id === editingCategory._id
              ? {
                  ...cat,
                  name: result.data.name,
                  description: result.data.description,
                  image: result.data.image,
                  showOnHome: result.data.show_on_home,
                  homeOrder: result.data.home_order,
                }
              : cat
          ));
          alert('Category updated successfully!');
        } else {
          alert(result.message || 'Failed to update category');
        }
      } else {
        // Add new category
        const response = await fetch('http://localhost:5000/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            image: formData.image,
            showOnHome: formData.showOnHome,
            homeOrder: formData.homeOrder,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          const newCategory: Category = {
            _id: result.data.id,
            name: result.data.name,
            description: result.data.description,
            image: result.data.image || '/api/placeholder/400/300',
            productCount: 0,
            showOnHome: result.data.show_on_home,
            homeOrder: result.data.home_order,
          };
          setCategories([...categories, newCategory]);
          alert('Category added successfully!');
        } else {
          alert(result.message || 'Failed to add category');
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Check console for details.');
    }
  };

  const toggleHomeVisibility = async (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (!category) return;

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          image: category.image,
          showOnHome: !category.showOnHome,
          homeOrder: category.homeOrder,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCategories(categories.map(cat =>
          cat._id === categoryId
            ? { ...cat, showOnHome: !cat.showOnHome }
            : cat
        ));
      } else {
        alert('Failed to update category visibility');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Failed to update category');
    }
  };

  const moveCategory = (categoryId: string, direction: 'up' | 'down') => {
    const index = categories.findIndex(cat => cat._id === categoryId);
    if (index === -1) return;

    const newCategories = [...categories];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newCategories.length) return;

    // Swap
    [newCategories[index], newCategories[swapIndex]] = [newCategories[swapIndex], newCategories[index]];

    // Update homeOrder
    newCategories.forEach((cat, idx) => {
      cat.homeOrder = idx + 1;
    });

    setCategories(newCategories);
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCategories(categories.filter(cat => cat._id !== categoryId));
        alert('Category deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our carefully curated collection for every occasion.
            From casual everyday wear to elegant evening wear, find the perfect style for you.
          </p>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">
              Manage categories and control which ones appear on the home page
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group relative"
            >
              {/* Home Page Indicator */}
              {isAdmin && category.showOnHome && (
                <div className="absolute top-2 left-2 z-10 bg-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Home #{category.homeOrder}
                </div>
              )}

              {/* Category Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

                {/* Admin Controls Overlay */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="w-8 h-8 flex items-center justify-center bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors duration-200"
                      title="Edit category"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleHomeVisibility(category._id)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${
                        category.showOnHome
                          ? 'bg-pink-500 text-white hover:bg-pink-600'
                          : 'bg-white/90 text-gray-700 hover:bg-white'
                      }`}
                      title={category.showOnHome ? 'Hide from home' : 'Show on home'}
                    >
                      {category.showOnHome ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    {category.showOnHome && (
                      <>
                        <button
                          onClick={() => moveCategory(category._id, 'up')}
                          disabled={index === 0}
                          className="w-8 h-8 flex items-center justify-center bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors duration-200 disabled:opacity-50"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveCategory(category._id, 'down')}
                          disabled={index === categories.length - 1}
                          className="w-8 h-8 flex items-center justify-center bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors duration-200 disabled:opacity-50"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteCategory(category._id, category.name)}
                      className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {category.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.productCount} products
                  </span>
                  <Link
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Browse
                    <Eye className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Summer Dresses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Describe this category..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg">
                <input
                  type="checkbox"
                  id="showOnHome"
                  checked={formData.showOnHome}
                  onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                  className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="showOnHome" className="text-sm font-medium text-gray-700">
                  Show on Home Page
                </label>
              </div>

              {formData.showOnHome && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Page Order
                  </label>
                  <input
                    type="number"
                    value={formData.homeOrder}
                    onChange={(e) => setFormData({ ...formData, homeOrder: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
