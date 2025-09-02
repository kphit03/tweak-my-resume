package com.tweak.my.resume.tweak_my_resume.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.ResponseFormat;
import org.springframework.stereotype.Service;

@Service
public class AiService {
    private final ChatClient chatClient;

    //Spring AI auto configures ChatClient.Builder injection based on app properties
    public AiService(ChatClient.Builder builder) {
        chatClient = builder.build(); //creates configured ChatClient
    }

    //will pass in a plain text prompt, get back plain string response
    public String chat(String prompt) {
        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }

}
