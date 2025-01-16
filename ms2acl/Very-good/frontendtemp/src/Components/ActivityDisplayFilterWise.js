import React, { useState, useEffect } from 'react';
import './ActivityDisplay.css';
import { fetchCategoryById, fetchCategories } from '../Services/activityServices';
import ShareComponent from './shareComponent';

const ActivityDisplayFilterWise = ({ activity }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategoryName = async () => {
      try {
        if (activity.categoryId) {
          const category = await fetchCategoryById(activity.categoryId);
          setCategoryName(category.data.name);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };
    getCategoryName();
  }, [activity.categoryId]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const allCategories = await fetchCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    getCategories();
  }, []);

  return (
    <div className="activity-card">
      <h2 className="activity-title">{activity.name}</h2>
      <p className="activity-date">Date: {new Date(activity.date).toLocaleDateString()}</p>
      <p className="activity-price">Price: ${activity.price}</p>
      <p className="activity-duration">Duration: {activity.duration} minutes</p>
      <p className="activity-category">Category: {categoryName}</p>
      <p className="activity-ratings">Ratings: {activity.ratings}/5</p>
      <p className="activity-special-discount">Special Discount: {activity.specialDiscount}%</p>
      <p className="activity-booking-status">Booking Open: {activity.bookingOpen ? "Yes" : "No"}</p>

      <div className="tags-container">
        {activity.tags.map((tag, index) => (
          <span key={index} className="activity-tag">{tag.name}</span>
        ))}
      </div>
      <ShareComponent type="activity" id={activity._id} />
    </div>
  );
};

export default ActivityDisplayFilterWise;
