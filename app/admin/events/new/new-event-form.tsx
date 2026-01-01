// app/admin/events/new/new-event-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "../../../../app/actions/events";

export function NewEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createEvent(formData);
      if (result.success) {
        alert('Event created successfully!');
        router.push('/admin/events');
      } else {
        alert('Failed to create event');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Image
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload an image for your event (JPEG, PNG, etc.)
            </p>
          </div>
          {previewImage && (
            <div className="w-32 h-32 border rounded-md overflow-hidden">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Title English */}
      <div>
        <label htmlFor="title_en" className="block text-sm font-medium text-gray-700">
          Title (English)
        </label>
        <input
          type="text"
          name="title_en"
          id="title_en"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      {/* Title French */}
      <div>
        <label htmlFor="title_fr" className="block text-sm font-medium text-gray-700">
          Title (French)
        </label>
        <input
          type="text"
          name="title_fr"
          id="title_fr"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      {/* Description English */}
      <div>
        <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">
          Description (English)
        </label>
        <textarea
          name="description_en"
          id="description_en"
          rows={3}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      {/* Description French */}
      <div>
        <label htmlFor="description_fr" className="block text-sm font-medium text-gray-700">
          Description (French)
        </label>
        <textarea
          name="description_fr"
          id="description_fr"
          rows={3}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <select
          name="city"
          id="city"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select a city</option>
          <option value="toronto">Toronto</option>
          <option value="montreal">Montreal</option>
          <option value="vancouver">Vancouver</option>
          <option value="calgary">Calgary</option>
          <option value="ottawa">Ottawa</option>
          <option value="edmonton">Edmonton</option>
        </select>
      </div>
      
      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          id="category"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select a category</option>
          <option value="community">Community</option>
          <option value="sports">Sports</option>
          <option value="arts">Arts</option>
          <option value="food">Food</option>
          <option value="education">Education</option>
          <option value="business">Business</option>
        </select>
      </div>
      
      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          name="date"
          id="date"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      {/* Time */}
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Time
        </label>
        <input
          type="time"
          name="time"
          id="time"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          id="location"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      {/* Featured */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_featured"
          id="is_featured"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
          Feature this event on homepage
        </label>
      </div>
      
      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}