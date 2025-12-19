---
layout: post
title: Defining the Data Contract Manager
subtitle: Aligning decentralized teams through shared data agreements
tags: [Data Management, Data Mesh, Data Contracts, Metadata, Decentralized Data]
project_type: professional
comments: true
thumbnail-img: assets/img/data_contract_1.png
share-img: assets/img/data_contract_1.png
# author: Cynthia Mengyuan Li
---

As organizations move toward decentralized data ownership and data mesh architectures, the need for clear, enforceable data agreements becomes business-critical. At Volvo Cars, growing domain autonomy meant that each team could publish data products independently — but without alignment on definitions, structure, and quality, cross-domain integrations became fragile and slow.

To address this, I helped shape and develop the Data Contract Manager, a web application that streamlines how teams create, validate, and maintain YAML-based data contracts. This project became a foundational part of enabling trust, consistency, and interoperability across our federated data ecosystem.

---
## The Product Problem

How do we allow dozens of autonomous teams to ship data products independently without breaking each other?

Decentralization brings speed — but also risk. Without a shared mechanism for agreements:

- Data producers define fields differently

- Data consumers rely on undocumented expectations

- Schema drift creates breaking changes

- Quality issues surface late in the pipeline

Metadata tools help with describing datasets, but they don’t enforce rules. We needed a product that made it easy — and even pleasant — for non-expert users to draft, validate, and maintain formal data contracts.

---

**Metadata ≠ Data Contracts**

One early confusion among teams was the difference between metadata and contracts. I created a conceptual model that clarified this distinction for product stakeholders:

Metadata explains what the data is.

Data contracts define what the data must be.

Metadata supports discoverability; contracts support reliability. By aligning the organization on this, we unblocked multiple design decisions — such as what fields must be validated, what rules must be enforced, and what schemas must be standardized across domains.

This clarity also shaped our UX approach: bringing schema visibility and contract validation into the same workflow so that users can understand context and constraints at a glance.

For more details, please refer to the [Understanding Metadata vs. Data Contracts](#understanding-metadata-vs-data-contracts) section.

---

## What We Built (and Why)

The Data Contract Manager intentionally focuses on usability over complexity. Our goal: make contract creation feel straightforward and governed, not technical or intimidating.

![data_contract](../assets/img/data_contract_1.png)

## Key Product Capabilities

- **Template-based creation**
Reduces onboarding friction and reinforces standardization across domains.

- **Inline guidance and smart input assistance**
Helps users understand required fields, constraints, and best practices without documentation hunting.

- **Schema validation**
Ensures contracts are compliant before they are committed — reducing downstream breakages.

- **Version control & Azure Blob integration**
Keeps agreements secure, auditable, and easy to manage at scale.

- **Contract review before finalization**
Encourages cross-team alignment and avoids surprises during downstream consumption.

- **Reusable templates**
Enables teams with similar data structures to accelerate contract creation and reduce duplication.

---

## How This Product Fits Into a Data Mesh Strategy

From a product perspective, the Data Contract Manager acts as:

- **A governance guardrail for decentralized teams**

- **A reliability layer for data consumers**

- **A contract-driven backbone for evolving data pipelines**

- **A collaboration interface for producers, consumers, and platform teams**

## Reflection — What I Learned as a Product Manager

Building the Data Contract Manager was a lesson in balancing central standards with federated autonomy. A few key reflections:

**If your product supports decentralization, clarity becomes your UX.**
Users from different domains should arrive at the same understanding without extensive training.

**Invisible value matters.**
Users rarely celebrate validation rules — but the absence of data pipeline failures is a huge organizational win.

**Governance is a product.**
Not a policy. The more that rules are codified in the UX, the less teams feel governed and the more they feel supported.

---

## Explore Further

For detailed instructions on setting up and utilizing this tool, refer to GitHub: [Data Contract Manager](https://github.com/volvo-cars/data-contract-manager).

---

## Bonus: Understanding Metadata vs. Data Contracts

**Metadata** and **data contracts** are both foundational concepts in the realm of data management, but they serve distinct purposes and convey different kinds of information. Here's a breakdown of their differences:

### Metadata

1. **Definition**: Metadata is "data about data." It provides descriptive, structural, or administrative details about data to facilitate understanding, management, and usage. Essentially, it describes attributes and characteristics of the actual data.

2. **Types**:
   - **Descriptive Metadata**: Describes the content for discovery and identification. This might include information like title, author, or keywords.
   - **Structural Metadata**: Details how data objects are organized or related, like pages in a book or relationships between tables in a database.
   - **Administrative Metadata**: Offers information to manage or maintain a data resource. This could include creation dates, file types, and access permissions.

3. **Purpose**: Metadata aims to provide context, clarity, and manageability to data, making it more useful and accessible.

4. **Examples**:
   - In a photograph, metadata might include details like the date taken, camera type, resolution, etc.
   - In a database, metadata could describe table relationships, data types, or constraints.

### **Data Contract**

1. **Definition**: A data contract is a formal agreement about the representation, format, and definition of data being exchanged between different systems or components. It's essentially a specification or protocol ensuring that data shared between systems meets particular criteria.

2. **Content**:
   - **Format and Type Specifications**: Details the expected format (e.g., JSON, XML) and data types (e.g., integer, string).
   - **Constraints and Rules**: Specifies any conditions data must meet, such as validation rules.
   - **Semantics**: Clarifies the meaning of the data, ensuring that both parties interpret it consistently.

3. **Purpose**: Data contracts aim to ensure interoperability between systems and components, preventing potential integration issues and misunderstandings.

4. **Examples**:
   - In web services, a data contract might detail the expected structure and format of request and response payloads.
   - In data exchanges between organizations, the contract might specify the required fields, their formats, acceptable values, and more.

### Key Difference

The core distinction lies in their focus. While metadata is all about describing and providing context to data, a data contract is about setting rules and agreements for how data is to be shared or exchanged between systems. In a sense, metadata can be a part of a data contract when the contract specifies certain descriptive details about the data being exchanged, but the data contract extends beyond just descriptions to include explicit rules and requirements.
