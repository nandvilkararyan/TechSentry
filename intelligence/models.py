from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SearchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='search_history')
    query = models.CharField(max_length=500)
    filters = models.JSONField(default=dict, blank=True)
    results_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.query}"

class SavedReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_reports')
    title = models.CharField(max_length=200)
    technology = models.CharField(max_length=200)
    content = models.TextField()
    sections = models.JSONField(default=list)
    word_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    technology = models.CharField(max_length=200)
    query = models.CharField(max_length=500)
    last_updated = models.DateTimeField(auto_now=True)
    new_papers_count = models.IntegerField(default=0)
    new_patents_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-last_updated']
        unique_together = ['user', 'technology']
    
    def __str__(self):
        return f"{self.user.email} - {self.technology}"

class TechnologyProfile(models.Model):
    technology = models.CharField(max_length=200, unique=True)
    query = models.CharField(max_length=500)
    papers_count = models.IntegerField(default=0)
    patents_count = models.IntegerField(default=0)
    companies_count = models.IntegerField(default=0)
    news_count = models.IntegerField(default=0)
    trl_level = models.IntegerField(default=1)
    trl_confidence = models.FloatField(default=0.0)
    last_analyzed = models.DateTimeField(auto_now=True)
    cached_data = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['technology']
    
    def __str__(self):
        return f"{self.technology} (TRL {self.trl_level})"

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    session_id = models.CharField(max_length=100, unique=True)
    messages = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-last_activity']
    
    def __str__(self):
        return f"{self.user.email} - {self.session_id}"
