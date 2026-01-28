---
layout: post
title: Four-Layer Harm Mitigation for Enterprise AI
subtitle: Layered safety architecture from model to UX
tags: [Responsible AI, Risk Analysis, Multi-Layer Safety, Harm Mitigation, Enterprise AI, Product Design, Trust and Safety]
project_type: enterprise
# cover-img: assets/img/data-book-summary-1.png
thumbnail-img: assets/img/architecture.png
share-img: assets/img/architecture.png
comments: true
# author: Cynthia Mengyuan Li
---

Over the past year building generative AI capabilities inside Volvo Cars’ procurement organization, I’ve learned that the most important part of AI product development isn’t the model, or even the architecture. It’s the product thinking that wraps around all of it. The rapid rise of LLMs has made it easy to experiment, but it has also made it far too tempting to skip the foundational strategic questions: What problem are we solving? How will this fit into existing workflows? What could go wrong? And what makes this solution meaningfully better than what already exists?

This reflection captures my personal principles for building AI products responsibly and strategically - principles that formed the backbone of how I shaped our procurement AI integration at Volvo Cars. It’s not a technical deep dive. It’s a look into how I think, how I make decisions, and how I design AI to be not just powerful, but safe, trustworthy, and truly needed.

A recent article on [Builder.io](https://www.builder.io/blog/build-ai) emphasized the importance of crafting unique AI products that stand out in an increasingly crowded field.

---

**Start With the Workflow, Not the Model**

When I began exploring how AI could improve procurement, the first instinct from many teams was to ask, “Which model should we use - GPT-4, GPT-3.5, or a fine-tuned alternative?” But I quickly realized none of those questions mattered until we deeply understood the workflow. So instead of opening an LLM playground, I started sitting with buyers and watching how they actually worked.

I noticed how they bounced between VGS, SI+, and VPC. I watched them dig through PDFs, reconcile price changes, hunt down attachments, and sometimes ask a colleague just to validate a detail. It became clear that the true problem wasn’t lack of functionality. It was cognitive load - the mental burden of connecting fragmented information scattered across three systems.

That insight fundamentally changed how I framed the project. Instead of “building an AI tool,” I focused on redesigning a workflow where AI acts as the semantic layer that unifies system knowledge and reduces uncertainty. AI became valuable not because it was clever, but because it removed friction that humans were never meant to carry.

---

**Reduce Risk Before Adding Intelligence**

Procurement work has legal, financial, and compliance implications. Mistakes have real costs. That meant I couldn’t approach the project by asking only what AI could do - I had to ask what AI should never do. This shift in perspective made risk-mitigation a strategic pillar rather than an afterthought.

Before designing any feature, I mapped potential failure points: where hallucinations might mislead buyers, which questions were too ambiguous for an LLM to answer confidently, and which contract interpretations must always remain grounded in source documents. By defining the “no-go zones” early, I ensured intelligence was layered into the system only where it could operate safely.

This taught me that discipline is far more important than ambition in enterprise AI. A safe, predictable system outperforms a “smart” but unreliable one every time.

---

**Safety Is Not a Feature - It’s a Multi-Layered Design Philosophy**

People often think AI safety is purely technical. But I now see it as a deeply cross-functional product challenge. For our procurement solution, I embraced a layered approach: selecting the right model, activating Azure OpenAI’s platform-level safety filters, designing strong retrieval and grounding workflows, and shaping the user experience so that misuse becomes harder than correct use.

Each layer solved a different part of the risk landscape. The model layer ensured we weren’t over-engineering; the safety system layer handled guardrails and logging; the grounding layer ensured every answer was traceable to the original contract; and the UX layer guided buyers into asking the right questions in the right way.

The cumulative effect was profound. The model didn’t feel magical - it felt trustworthy. And trust, I realized, is the most important product outcome in enterprise AI.

---

**The Four-Layered Approach to Harm Mitigation**

Developing safe generative AI solutions requires a structured approach. Here's how I applied this approach in our procurement AI project:

### 1. The Model Layer

Choosing the right model is crucial. While GPT-4 is powerful, a simpler model might suffice for specific tasks, reducing the risk of harmful content. I fine-tuned our model with procurement-specific data to ensure relevant and safe outputs.

**Example:**
- **Problem Identified:** Risk of generating inaccurate procurement contract details.
- **Solution:** Fine-tune GPT-4 with procurement-specific data to understand the nuances of contracts and queries.

### 2. The Safety System Layer

Platform-level configurations help mitigate harm. I used Azure OpenAI Service’s content filters to manage content severity and implemented abuse detection algorithms and alert systems to prevent misuse and respond promptly to any harmful behavior.

**Example:**
- **Problem Identified:** Potential for generating inappropriate responses.
- **Solution:** Implement content filters and abuse detection systems to monitor and flag inappropriate content.

### 3. The Metaprompt and Grounding Layer

Constructing prompts is critical. I used metaprompts to define behavioral parameters and applied prompt engineering to ensure safe outputs. Retrieval augmented generation (RAG) was used to pull contextual data from trusted sources, enhancing prompt quality and safety.

**Example:**
- **Problem Identified:** Ambiguity in user queries leading to harmful responses.
- **Solution:** Use metaprompts and RAG to provide clear, contextually relevant instructions, pulling data from reliable sources.

### 4. The User Experience Layer

This layer covers the application interface and user documentation. I designed user interfaces to limit inputs to specific subjects and types, validating inputs and outputs to reduce the risk of harmful responses. Transparent documentation about the system’s capabilities and limitations was also crucial.

**Example:**
- **Problem Identified:** Users inputting vague queries leading to misleading responses.
- **Solution:** Design interfaces guiding precise queries and provide thorough documentation on system use and limitations.

---

**Use AI Where It Adds Value - Not Everywhere It Can Fit**

One of the biggest lessons I learned is that not everything needs to be solved with an LLM. Some tasks are much better handled with deterministic rules, structured search, or backend logic. Many AI products fail because they assume a model should sit at the center of everything.

In the procurement project, I intentionally designed a hybrid architecture. The LLM handled reasoning and summarization. RAG handled truth and grounding. Backend logic handled IDs, metadata, and compliance rules. Traditional search handled exact matches. This mix allowed us to optimize for cost, accuracy, and speed - all without turning every interaction into a model call.

Ultimately, this approach helped me see AI not as a replacement for traditional software, but as an orchestrator. It’s the connective tissue that makes existing systems more accessible and intelligent, without overshadowing the strengths of traditional engineering.


---
**Differentiation Comes From Insight, Not Models**

One of the most humbling realizations I had is that access to models is no longer a competitive advantage. Anyone can use GPT-4. Anyone can wire up a RAG pipeline. But not everyone understands the domain deeply enough to design systems that truly solve problems.

What made our procurement AI successful wasn’t the sophistication of the model. It was the specificity of the product insight: how buyers search, what they fear missing, how contracts evolve, the subtle differences between VGS and VPC content types, the edge cases around amendments, and the real-world variation in document formats. These nuances made the solution genuinely defensible - because they came from watching, listening, and learning, not from plugging a model into a template.

---
**Validate With Real Users, Not Demos**

AI demos are thrilling - everything works, everything looks smart, everything is snappy. But the moment you bring real workflows and real documents into the picture, the cracks appear. That’s why I leaned heavily on user testing, both structured and exploratory.

Sometimes the AI responded perfectly; other times it struggled because the prompt was vague or the document structure was messy. But every failure taught us something useful. We discovered that users needed training as much as the model did. We realized that citations and transparency mattered more than conversational polish. And we learned which tasks needed hybrid logic rather than pure AI.

This reinforced a principle I now deeply believe in: AI products live or die in the hands of real users, not in the hands of engineers.

---

**Scoping Narrowly Is a Strategic Advantage**

The most counterintuitive lesson I’ve learned is that the fastest way to scale an AI system is to start with a very small scope. With procurement, I deliberately resisted the temptation to boil the ocean. Instead of integrating all procurement systems at once, I focused on VGS. That constraint allowed the team to validate our assumptions earlier, refine the safety layers quickly, and avoid building a system that was too complex to adopt.

By choosing depth over breadth, we created a foundation that could scale predictably - and safely. It reminded me that good product strategy is often about protecting the team from over-ambition, not encouraging them to add more features.

---

Closing Reflection

Building AI for procurement at Volvo Cars taught me that great AI products come from clarity, constraint, and thoughtful design. The technology is powerful - but it is the discipline around the technology that determines whether it becomes transformative or dangerous.

Today, when I think about designing AI systems, I don’t start with models, APIs, or capabilities. I start with workflows, risks, trust, adoption, and the human experience around the AI. I ask what value the user will gain, what uncertainty the system can remove, and what design decisions must be made to protect both the business and the user.

And above all, I anchor on this belief:

The best AI products for **large scale high stake systems** might have to be the ones that feel boring - because they work the same way, every time, for every user, without surprises.

---

## Appendix

### User Study and Implementation

A thorough user study was vital in identifying and addressing potential problems:
- **User Onboarding:** Training users on how to interact with the AI tool, emphasizing prompt construction.
- **Controlled Experiments:** Structured scenario-based testing to ensure functionalities and safety measures.
- **Exploratory Testing:** Open-ended user engagement to provide feedback on usability and potential harms.

**Findings:**
- Users initially struggled with prompt specificity, leading to irrelevant outputs. Training improved this.
- Content filters effectively flagged inappropriate responses, enhancing safety.
- Feedback highlighted the importance of clear documentation and user guidance to prevent misuse.

### Avoiding Common Pitfalls in AI Product Development

Reflecting on Builder.io’s article, here are some pitfalls to avoid and strategies to develop effective AI applications:

### 1. **Lack of Unique Features**
Many AI products are mere extensions of existing models like ChatGPT. This easy route often leads to products lacking distinctiveness, rendering them easily replicable and undifferentiated.

Even if you develop substantial technology with LLMs where OpenAI plays a minor yet vital role, you might still face two significant challenges.

### 2. **Cost and Customization Constraints**
Large Language Models (LLMs) are not only costly and slow but also often include irrelevant data for specific applications, offering limited customization. For instance, GitHub Copilot, as reported by the Wall Street Journal, was [operating at a loss per user](https://www.wsj.com/tech/ai/ais-costly-buildup-could-make-early-products-a-hard-sell-bdd29b9f), indicating a mismatch between user willingness to pay and the cost of running services on top of LLMs.

Moreover, while fine-tuning can help, it falls short of providing the level of customization needed for specific use cases.

### 3. **Performance Limitations**
The slow response time of LLMs is a significant drawback, especially in applications where immediate feedback is crucial.

### A More Effective AI Development Strategy

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

### Harnessing LangChain and Vector Stores

LangChain is a framework that simplifies the development of applications using large language models, ideal for tasks like document analysis and chatbots. Vector stores, meanwhile, are crucial for managing and retrieving vector data, essential in machine learning applications.
