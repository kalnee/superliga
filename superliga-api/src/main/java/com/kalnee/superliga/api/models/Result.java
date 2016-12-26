package com.kalnee.superliga.api.models;

import java.util.List;

public class Result {

    private Integer homeSets;
    private Integer awaySets;
    private List<String> partials;

    public Integer getAwaySets() {
        return awaySets;
    }

    public void setAwaySets(Integer awaySets) {
        this.awaySets = awaySets;
    }

    public List<String> getPartials() {
        return partials;
    }

    public void setPartials(List<String> partials) {
        this.partials = partials;
    }

    public Integer getHomeSets() {
        return homeSets;
    }

    public void setHomeSets(Integer homeSets) {
        this.homeSets = homeSets;
    }
}
