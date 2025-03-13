-- Create databases for different environments
CREATE DATABASE express_microservice_dev;
CREATE DATABASE express_microservice_test;
CREATE DATABASE express_microservice_qa;
CREATE DATABASE express_microservice;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE express_microservice_dev TO postgres;
GRANT ALL PRIVILEGES ON DATABASE express_microservice_test TO postgres;
GRANT ALL PRIVILEGES ON DATABASE express_microservice_qa TO postgres;
GRANT ALL PRIVILEGES ON DATABASE express_microservice TO postgres; 