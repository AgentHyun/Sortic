package org.sortic.sorticproject.Entity;

import java.sql.Timestamp;

public class Category {

    private int category_id;  // 카테고리 ID
    private Integer wholesaler_code;  // 도매 링크 ID (nullable이므로 Integer로)
    private String user_id;  // 사용자 ID
    private String category_name;  // 카테고리 이름
    private Timestamp created_category_time;  // 생성 시간

    // Getters and Setters
    public int getCategory_id() {
        return category_id;
    }

    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }

    public Integer getWholesale_link_id() {
        return wholesaler_code;
    }

    public void setWholesale_link_id(Integer wholesale_link_id) {
        this.wholesaler_code = wholesale_link_id;
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
