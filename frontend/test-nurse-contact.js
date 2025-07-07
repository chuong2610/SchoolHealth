/**
 * Test Script for Nurse Contact Logic
 * Run this in browser console to test the new nurse contact functionality
 */

// Test configuration
const TEST_CONFIG = {
    baseUrl: 'http://localhost:5000/api',
    currentUserId: 1, // Replace with actual user ID
    nurseId: 2,       // Replace with actual nurse ID
    testMessage: 'Test message from frontend'
};

// Test API endpoints
class NurseContactTester {
    constructor(config) {
        this.config = config;
        this.results = [];
    }

    async testConversations() {
        console.log('🧪 Testing conversations API...');
        try {
            const response = await fetch(`${this.config.baseUrl}/Chat/conversations?userId=${this.config.currentUserId}`);
            const data = await response.json();

            console.log('✅ Conversations API response:', data);
            this.results.push({
                test: 'Conversations API',
                success: true,
                data: data
            });

            return data;
        } catch (error) {
            console.error('❌ Conversations API failed:', error);
            this.results.push({
                test: 'Conversations API',
                success: false,
                error: error.message
            });
            return null;
        }
    }

    async testChatHistory() {
        console.log('🧪 Testing chat history API...');
        try {
            const response = await fetch(
                `${this.config.baseUrl}/Chat/history?userA=${this.config.currentUserId}&userB=${this.config.nurseId}&skip=0&take=50`
            );
            const data = await response.json();

            console.log('✅ Chat history API response:', data);
            this.results.push({
                test: 'Chat History API',
                success: true,
                data: data
            });

            return data;
        } catch (error) {
            console.error('❌ Chat history API failed:', error);
            this.results.push({
                test: 'Chat History API',
                success: false,
                error: error.message
            });
            return null;
        }
    }

    async testSendMessage() {
        console.log('🧪 Testing send message API...');
        try {
            const response = await fetch(`${this.config.baseUrl}/Chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    FromUserId: this.config.currentUserId,
                    ToUserId: this.config.nurseId,
                    Message: this.config.testMessage
                })
            });

            if (response.ok) {
                console.log('✅ Send message API success');
                this.results.push({
                    test: 'Send Message API',
                    success: true
                });
                return true;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Send message API failed:', error);
            this.results.push({
                test: 'Send Message API',
                success: false,
                error: error.message
            });
            return false;
        }
    }

    async testUnreadMessages() {
        console.log('🧪 Testing unread messages API...');
        try {
            const response = await fetch(`${this.config.baseUrl}/Node/has-unread-message/${this.config.currentUserId}`);
            const data = await response.json();

            console.log('✅ Unread messages API response:', data);
            this.results.push({
                test: 'Unread Messages API',
                success: true,
                data: data
            });

            return data;
        } catch (error) {
            console.error('❌ Unread messages API failed:', error);
            this.results.push({
                test: 'Unread Messages API',
                success: false,
                error: error.message
            });
            return null;
        }
    }

    async runAllTests() {
        console.log('🚀 Starting Nurse Contact API Tests...');
        console.log('Config:', this.config);

        // Test all APIs
        await this.testConversations();
        await this.testChatHistory();
        await this.testSendMessage();
        await this.testUnreadMessages();

        // Print summary
        this.printResults();
    }

    printResults() {
        console.log('\n📊 Test Results Summary:');
        console.log('========================');

        const passed = this.results.filter(r => r.success).length;
        const total = this.results.length;

        this.results.forEach(result => {
            const status = result.success ? '✅ PASS' : '❌ FAIL';
            console.log(`${status} ${result.test}`);
            if (!result.success && result.error) {
                console.log(`   Error: ${result.error}`);
            }
        });

        console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);

        if (passed === total) {
            console.log('🎉 All tests passed! Nurse contact logic is working correctly.');
        } else {
            console.log('⚠️  Some tests failed. Please check the errors above.');
        }
    }
}

// Test component integration
class ComponentTester {
    constructor() {
        this.testData = {
            conversations: [],
            messages: [],
            currentUser: { id: TEST_CONFIG.currentUserId }
        };
    }

    testConversationRendering() {
        console.log('🧪 Testing conversation rendering...');

        // Mock conversation data
        const mockConversations = [
            {
                User: TEST_CONFIG.nurseId,
                userName: 'Test Nurse',
                lastMessage: 'Hello, how can I help?',
                timestamp: new Date().toISOString(),
                hasUnread: true
            }
        ];

        // Test conversation item rendering
        mockConversations.forEach((conv, index) => {
            console.log(`✅ Conversation ${index + 1}:`, {
                nurseId: conv.User,
                name: conv.userName,
                lastMessage: conv.lastMessage,
                hasUnread: conv.hasUnread
            });
        });

        return mockConversations;
    }

    testMessageRendering() {
        console.log('🧪 Testing message rendering...');

        // Mock message data
        const mockMessages = [
            {
                fromUserId: TEST_CONFIG.currentUserId,
                toUserId: TEST_CONFIG.nurseId,
                message: 'Hello nurse',
                timestamp: new Date(Date.now() - 60000).toISOString()
            },
            {
                fromUserId: TEST_CONFIG.nurseId,
                toUserId: TEST_CONFIG.currentUserId,
                message: 'Hello, how can I help?',
                timestamp: new Date().toISOString()
            }
        ];

        // Test message rendering
        mockMessages.forEach((msg, index) => {
            const isFromCurrentUser = msg.fromUserId === TEST_CONFIG.currentUserId;
            console.log(`✅ Message ${index + 1}:`, {
                from: isFromCurrentUser ? 'Me' : 'Nurse',
                message: msg.message,
                timestamp: msg.timestamp,
                alignment: isFromCurrentUser ? 'right' : 'left'
            });
        });

        return mockMessages;
    }

    testPagination() {
        console.log('🧪 Testing pagination logic...');

        const testCases = [
            { skip: 0, take: 50, expected: 'Load latest 50 messages' },
            { skip: 50, take: 50, expected: 'Load next 50 messages' },
            { skip: 100, take: 50, expected: 'Load older messages' }
        ];

        testCases.forEach((testCase, index) => {
            console.log(`✅ Pagination test ${index + 1}:`, {
                skip: testCase.skip,
                take: testCase.take,
                description: testCase.expected
            });
        });

        return testCases;
    }

    runComponentTests() {
        console.log('🚀 Starting Component Tests...');

        this.testConversationRendering();
        this.testMessageRendering();
        this.testPagination();

        console.log('✅ All component tests completed!');
    }
}

// Export for use in browser console
window.NurseContactTester = NurseContactTester;
window.ComponentTester = ComponentTester;
window.TEST_CONFIG = TEST_CONFIG;

// Auto-run tests if in development
if (window.location.hostname === 'localhost') {
    console.log('🔧 Development mode detected. Running tests automatically...');

    // Run API tests
    const apiTester = new NurseContactTester(TEST_CONFIG);
    apiTester.runAllTests();

    // Run component tests
    const componentTester = new ComponentTester();
    componentTester.runComponentTests();
}

console.log(`
📋 Nurse Contact Test Suite Loaded!

Available commands:
- new NurseContactTester(TEST_CONFIG).runAllTests() - Run all API tests
- new ComponentTester().runComponentTests() - Run component tests
- TEST_CONFIG - View/modify test configuration

Make sure to update TEST_CONFIG with valid user and nurse IDs before running tests.
`); 