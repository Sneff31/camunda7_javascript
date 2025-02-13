import asyncio
from pyzeebe import ZeebeWorker, ZeebeClient

# Define your task handler
async def handle_task(job):
    print(f"Received job: {job}")
    # Do something with the job, such as processing data or making an API call
    return job.complete(result={"message": "Task completed successfully"})

async def main():
    # Create a Zeebe client
    client = ZeebeClient(grpc_channel="localhost:26500",max_connection_retries=3)

    # Create the worker with a specific task type
    worker = ZeebeWorker(client)

    # Register the task handler for the task type "my-task"
    worker.add_task_handler("my-task", handle_task)

    # Start the worker to begin processing tasks
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())
