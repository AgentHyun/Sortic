package org.sortic.sorticproject.Entity;



public class Element {


    private int elements_name_id;  // 요소 이름 ID
    private int category_id;       // 카테고리 ID (외래키)
    private String elements_name;  // 요소 이름
    private int elements_price;    // 요소 가격
    private String elements_image; // 이미지 경로

    // 기본 생성자
    public Element() {}

    // Getters and Setters
    public int getElements_name_id() {
        return elements_name_id;
    }

    public void setElements_name_id(int elements_name_id) {
        this.elements_name_id = elements_name_id;
    }

    public int getCategory_id() {
        return category_id;
    }

    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }

    public String getElements_name() {
        return elements_name;
    }

    public void setElements_name(String elements_name) {
        this.elements_name = elements_name;
    }

    public int getElements_price() {
        return elements_price;
    }

    public void setElements_price(int elements_price) {
        this.elements_price = elements_price;
    }

    public String getElements_image() {
        return elements_image;
    }

    public void setElements_image(String elements_image) {
        this.elements_image = elements_image;
    }
}
