package com.example.mypollapp;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    LinearLayout layout;

    String[] questions = {
            "Do you like online learning?",
            "Should phones last 5 years?",
            "Is AI useful?",
            "Should coding be taught in school?",
            "Do you like Android?",
            "Is technology improving education?",
            "Do you use cloud storage?",
            "Should apps be free?",
            "Do you read app reviews?",
            "Is dark mode important?",
            "Should social media regulate fake news?",
            "Is My Poll App useful?"
    };

    String[] votes = new String[12];

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        layout = findViewById(R.id.questionLayout);

        for(int i=0;i<questions.length;i++){

            TextView q = new TextView(this);
            q.setText(questions[i]);
            q.setTextSize(18);

            Button yes = new Button(this);
            yes.setText("Yes");

            Button no = new Button(this);
            no.setText("No");

            int index = i;

            yes.setOnClickListener(v -> votes[index] = "Yes");
            no.setOnClickListener(v -> votes[index] = "No");

            layout.addView(q);
            layout.addView(yes);
            layout.addView(no);
        }
    }
}