package com.example.demo.card.dto;

import java.sql.Timestamp;

public class Category {

    private int category_id;  // categoryId -> category_id로 변경
    private String user_id;   // userId -> user_id로 변경
    private String category_name; // categoryName -> category_name으로 변경
    private Timestamp created_category_time; // createdCategoryTime -> created_category_time으로 변경

    // Getters and Setters
    public int getCategory_id() {
        return category_id;
    }

    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getCategory_name() {
        return category_name;
    }

    public void setCategory_name(String category_name) {
        this.category_name = category_name;
    }

    public Timestamp getCreated_category_time() {
        return created_category_time;
    }

    public void setCreated_category_time(Timestamp created_category_time) {
        this.created_category_time = created_category_time;
    }
}
