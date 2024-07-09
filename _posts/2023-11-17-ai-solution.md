---
layout: post
title: Crafting Safe and Impactful AI Solutions
subtitle: "A Comprehensive Guide to Developing Distinctive and Secure AI Applications"
tags: [LLM, AI, Safety, Generative, OpenAI, Azure, LangChain, RAG, GPT-4]
comments: true
author: Cynthia Mengyuan Li
---

In my journey through AI development, leveraging tools like LangChain and the OpenAI API, I've had the chance to explore the vast potential of generative AI while also encountering its challenges. Particularly insightful was my experience with Microsoft's Azure OpenAI Service, which highlighted crucial strategies for mitigating the potential harms of generative AI. Simultaneously, a recent article on [Builder.io](https://www.builder.io/blog/build-ai) emphasized the importance of crafting unique AI products that stand out in an increasingly crowded field.

## Project Overview

Our procurement AI project at Volvo Cars aimed to streamline the procurement process by integrating generative AI for contract management and decision-making. The existing system, comprising VGS, VPC, and SI+ systems, was fragmented and manual, leading to inefficiencies and risks. Our AI-driven solution sought to enhance accuracy, compliance, and efficiency.

## The Importance of Limiting AI Harm

Generative AI, while transformative, comes with the risk of generating harmful or inappropriate content. Ensuring AI solutions are safe and reliable is crucial, especially in sensitive areas like procurement, where inaccuracies or misuse can have significant financial and legal repercussions. In our project, mitigating these potential harms was paramount to ensure system reliability and user trust.

**Why Limit AI Harm:**
1. **Accuracy and Compliance:** Ensuring AI-generated information is accurate and complies with legal standards.
2. **User Trust:** Building trust in the AI system to encourage full adoption.
3. **Risk Mitigation:** Reducing the risk of generating harmful content to protect the organization from potential legal and financial consequences.

## The Four-Layered Approach to Harm Mitigation

Developing safe generative AI solutions requires a structured approach. Here's how we applied this approach in our procurement AI project:

### 1. The Model Layer

Choosing the right model is crucial. While GPT-4 is powerful, a simpler model might suffice for specific tasks, reducing the risk of harmful content. We fine-tuned our model with procurement-specific data to ensure relevant and safe outputs.

**Example:**
- **Problem Identified:** Risk of generating inaccurate procurement contract details.
- **Solution:** Fine-tune GPT-4 with procurement-specific data to understand the nuances of contracts and queries.

### 2. The Safety System Layer

Platform-level configurations help mitigate harm. We used Azure OpenAI Service’s content filters to manage content severity and implemented abuse detection algorithms and alert systems to prevent misuse and respond promptly to any harmful behavior.

**Example:**
- **Problem Identified:** Potential for generating inappropriate responses.
- **Solution:** Implement content filters and abuse detection systems to monitor and flag inappropriate content.

### 3. The Metaprompt and Grounding Layer

Constructing prompts is critical. We used metaprompts to define behavioral parameters and applied prompt engineering to ensure safe outputs. Retrieval augmented generation (RAG) was used to pull contextual data from trusted sources, enhancing prompt quality and safety.

**Example:**
- **Problem Identified:** Ambiguity in user queries leading to harmful responses.
- **Solution:** Use metaprompts and RAG to provide clear, contextually relevant instructions, pulling data from reliable sources.

### 4. The User Experience Layer

This layer covers the application interface and user documentation. We designed user interfaces to limit inputs to specific subjects and types, validating inputs and outputs to reduce the risk of harmful responses. Transparent documentation about the system’s capabilities and limitations was also crucial.

**Example:**
- **Problem Identified:** Users inputting vague queries leading to misleading responses.
- **Solution:** Design interfaces guiding precise queries and provide thorough documentation on system use and limitations.

## User Study and Implementation

A thorough user study was vital in identifying and addressing potential problems:
- **User Onboarding:** Training users on how to interact with the AI tool, emphasizing prompt construction.
- **Controlled Experiments:** Structured scenario-based testing to ensure functionalities and safety measures.
- **Exploratory Testing:** Open-ended user engagement to provide feedback on usability and potential harms.

**Findings:**
- Users initially struggled with prompt specificity, leading to irrelevant outputs. Training improved this.
- Content filters effectively flagged inappropriate responses, enhancing safety.
- Feedback highlighted the importance of clear documentation and user guidance to prevent misuse.

## Avoiding Common Pitfalls in AI Product Development

Reflecting on Builder.io’s article, here are some pitfalls to avoid and strategies to develop effective AI applications:

### 1. **Lack of Unique Features**
Many AI products are mere extensions of existing models like ChatGPT. This easy route often leads to products lacking distinctiveness, rendering them easily replicable and undifferentiated.

Even if you develop substantial technology with LLMs where OpenAI plays a minor yet vital role, you might still face two significant challenges.

### 2. **Cost and Customization Constraints**
Large Language Models (LLMs) are not only costly and slow but also often include irrelevant data for specific applications, offering limited customization. For instance, GitHub Copilot, as reported by the Wall Street Journal, was [operating at a loss per user](https://www.wsj.com/tech/ai/ais-costly-buildup-could-make-early-products-a-hard-sell-bdd29b9f), indicating a mismatch between user willingness to pay and the cost of running services on top of LLMs.

Moreover, while fine-tuning can help, it falls short of providing the level of customization needed for specific use cases.

### 3. **Performance Limitations**
The slow response time of LLMs is a significant drawback, especially in applications where immediate feedback is crucial.

## A More Effective AI Development Strategy

### 1. **Develop a Custom Toolchain**
Instead of solely depending on pre-trained models, consider creating a bespoke toolchain. This method, which combines a fine-tuned LLM with custom compilers and models, can yield faster, more reliable, and cost-effective solutions.

![architecture](../assets/img/architecture.png)

### 2. **Begin with Non-AI Solutions**
Start by addressing the problem with standard programming techniques. This approach helps pinpoint where AI can truly add value, avoiding the pitfall of over-relying on AI for solvable issues through traditional coding.

![conversation-array](../assets/img/conversation-array.png)

### 3. **Employ Specialized AI Models**
Use AI models specifically where they fill distinct gaps. For example, object detection models can be efficiently trained for specific tasks using platforms like Google's Vertex AI or LangChain for highly customized applications.

![performance-checklist](../assets/img/performance-checklist.png)

### 4. **Merge Code with AI**
A balanced mix of hand-coded logic and specialized AI models can lead to efficient and impactful solutions. This hybrid approach fosters the creation of responsive, high-quality products.

## Harnessing LangChain and Vector Stores

LangChain is a framework that simplifies the development of applications using large language models, ideal for tasks like document analysis and chatbots. Vector stores, meanwhile, are crucial for managing and retrieving vector data, essential in machine learning applications.

## **Advantages of Owning Your Models**

### **Benefit #1: Control Over Development**
Owning the models allows for continuous improvement, independent of external model providers like OpenAI.

### **Benefit #2: Enhanced Privacy Control**
This approach ensures full control over data privacy, a critical requirement for many privacy-conscious organizations.

## Conclusion

To develop safe and impactful AI applications, it’s essential to recognize the limitations of existing models and utilize appropriate tools. Leveraging frameworks like LangChain and vector store technologies can significantly enhance the ability to build tailored and robust AI solutions. By adopting a comprehensive and strategic approach, we can create AI products that are not only unique and valuable but also efficient, cost-effective, and secure. 🚀
