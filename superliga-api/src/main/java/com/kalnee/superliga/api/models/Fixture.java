package com.kalnee.superliga.api.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigInteger;
import java.util.Date;

@Document
public class Fixture {

    @Id
    private BigInteger id;
    private Integer round;
    private Date date;
    private String tv;
    private String home;
    private String away;

    public Fixture(String home, String away) {
        this.home = home;
        this.away = away;
    }

    public Fixture() {}

    private Result result;

    public BigInteger getId() {
        return id;
    }

    public void setId(BigInteger id) {
        this.id = id;
    }

    public Integer getRound() {
        return round;
    }

    public void setRound(Integer round) {
        this.round = round;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getTv() {
        return tv;
    }

    public void setTv(String tv) {
        this.tv = tv;
    }

    public String getHome() {
        return home;
    }

    public void setHome(String home) {
        this.home = home;
    }

    public String getAway() {
        return away;
    }

    public void setAway(String away) {
        this.away = away;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    @Override
    public String toString() {
        return "Fixture{" +
                "id=" + id +
                ", round=" + round +
                ", date=" + date +
                ", tv='" + tv + '\'' +
                ", home='" + home + '\'' +
                ", away='" + away + '\'' +
                ", result=" + result +
                '}';
    }
}
