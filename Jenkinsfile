pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'estoque-toner'
    }

    stages {
        stage('Clonar repositório') {
            steps {
                checkout scm
            }
        }

        stage('Build e Deploy via Docker Compose') {
            steps {
                echo "Iniciando containers..."
                // Permissão opcional se você estiver usando scripts auxiliares
                sh 'chmod +x jenkins/deploy.sh || true'
                
                // Build e up de todos os serviços
                sh 'docker compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            echo "✅ Todos os serviços foram iniciados com sucesso!"
            sh 'docker ps'
        }
        failure {
            echo "❌ Falha ao iniciar os containers. Verifique os logs."
        }
    }
}
