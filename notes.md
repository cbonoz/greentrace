<p align='center'>
<img src>
</p>

# Greentrace

Greentrace is an app that utilizes Hedera to provide users with a transparent and immutable platform for tracing product origins and verifying sustainability practices, fostering eco-conscious consumption habits.

Built for the <a href="https://dlt-climate-hackathon.devpost.com/" target="_blank">DLT climate hackathon</a> 2024.

<!-- Demo URL: usegreentrace.vercel.app (testnet)

Demo video: -->



## Inspiration
The inspiration behind Greentrace stems from the urgent need to address climate change and promote sustainable practices in supply chains. By leveraging emerging technologies like Distributed Ledger Technology (DLT) and the Hedera Guardian, Greentrace aims to empower consumers and businesses to make informed choices about the products they purchase and the companies they support. The goal is to create a transparent and auditable system that traces the origins of products back to their sustainable creation practices, thus promoting accountability and incentivizing eco-friendly production methods.

## What it does
Greentrace is a two-sided web application designed to facilitate the verification and registration of sustainable practices associated with products. On the verification side, users can upload a product's barcode, which is then scanned to extract the barcode text. This text is matched against the Hedera Guardian to verify the authenticity and sustainability of the product's origins.

On the registration side, businesses can assign a barcode a history record detailing the sustainable practices involved in the creation of the product. This record is stored on the Hedera network and is tamper-sealed using the Hedera Guardian, ensuring its integrity and immutability. Additionally, any green sustainability practices associated with the product are also recorded and stored securely on the DLT.

Anyone that uses the Greentrace policy has free access to the Greentrace web app for either uploading barcodes and their origin material or on the consumer side when viewing products out in the market in real time.

## How we built it

Greentrace leverages Hedera's innovative policies and methodologies to establish a robust framework for ensuring data integrity and accountability in sustainable supply chains. By implementing Hedera policies, Greentrace can securely freeze and tamper-seal sustainability records, guaranteeing their immutability and reliability. This approach not only instills trust in the information stored on the platform but also empowers users to make informed decisions about their purchases, thereby driving forward climate accountability and supporting the mission of Auditable, Discoverable, and Liquid sustainability/ESG assets.

## Repo structure
`/` (root): Main web project
`/methodology`: Methodology and policy for the Greentrace application (linked PR to come)

## How to run

`yarn; yarn dev`

The web project should now be running on port 3000

## Challenges we ran into
- Integrating the barcode reader functionality seamlessly into the web application.
- Ensuring the secure and tamper-proof storage of sustainability records using the Hedera Guardian.
- Designing an intuitive user interface for both the verification and registration sides of the application.

## Accomplishments that we're proud of
- Successfully implementing the barcode scanning feature for product verification.
- Establishing a secure and auditable system for recording sustainable practices using the Hedera Guardian.
- Creating a user-friendly web application that promotes transparency and accountability in supply chains.

## What we learned
- How to integrate third-party libraries and SDKs into web applications effectively.
- The importance of data security and integrity in sustainable supply chain management.
- Strategies for designing and developing user-friendly interfaces for complex applications.

## What's next for Greentrace
- Expanding the database of sustainable practices and certifications to provide more comprehensive information to consumers.
- Integrating additional features such as user reviews and ratings to further enhance transparency and trust in the system.
- Collaborating with manufacturers and retailers to encourage widespread adoption of Greentrace and promote sustainable consumption habits globally.
